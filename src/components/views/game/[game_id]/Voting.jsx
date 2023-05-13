import BaseContainer from "../../../ui/BaseContainer";
import { Loader, Paper, Radio, Stack, Table, Text, Title } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import StandardButton from "../../../ui/StandardButton";

const Voting = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const history = useHistory();
    const { gamePin, round, categoryIndex } = useParams();

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const category = categories[categoryIndex];
    const answers = StorageManager.getAnswers();
    const answer = answers[categoryIndex] ? answers[categoryIndex] : "none";
    const [answersToRate, setAnswersToRate] = useState([]);
    const [votes, setVotes] = useState({});
    const [timer, setTimer] = useState(null);
    const [done, setDone] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const [disableDoneButton, setDisableDoneButton] = useState(true);

    useEffect(() => {
        const newDict = {};
        answersToRate.forEach((obj) => {
            const key = Object.keys(obj)[0];
            newDict[key] = null;
        });
        setVotes(newDict);
    }, [answersToRate]);

    useEffect(() => {
        async function fetchData() {
            try {
                await new Promise((resolve) => setTimeout(resolve, 200));
                setAnswersToRate(await RestApi.getAnswersForCategory(gamePin, round, category));
            } catch (error) {
                console.log("Something went wrong while fetching the answers! See the console for details.");
            }
        }
        fetchData();
    }, [gamePin, round, category]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisableDoneButton(false);
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    async function doDone() {
        try {
            await RestApi.postVotes(gamePin, round, category, votes);
            history.push(`/game/${gamePin}/round/${round}/votingResults/${categoryIndex}`);
        } catch (error) {
            console.error(`Something went wrong while sending the votes: \n${handleError(error)}`);
        }
    }

    async function doSkipButton() {
        try {
            setSkipped(true);
            await RestApi.skip(gamePin);
        } catch (error) {
            console.error(`Something went wrong to skip: \n${handleError(error)}`);
        }
    }
    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };

    let onMessageReceived = async (msg) => {
        console.log(msg.type);
        if (msg.type === "votingEnd") {
            if (done === false) {
                setDone(true);
                await doDone();
            }
        } else if (msg.type === "votingTimer") {
            setTimer(msg.timeRemaining);
        }
    };

    const rows = answersToRate.map((answer) => (
        <tr key={Object.keys(answer)[0]}>
            <td>
                <strong>{Object.values(answer)[0]}</strong>{" "}
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Radio
                        color="green"
                        size="md"
                        name={Object.keys(answer)[0]}
                        checked={votes[Object.keys(answer)[0]] === "CORRECT_UNIQUE"}
                        onChange={() => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = "CORRECT_UNIQUE";
                            setVotes(newVotes);
                        }}
                    />
                </Stack>
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Radio
                        color="orange"
                        size="md"
                        name={Object.keys(answer)[0]}
                        checked={votes[Object.keys(answer)[0]] === "CORRECT_NOT_UNIQUE"}
                        onChange={() => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = "CORRECT_NOT_UNIQUE";
                            setVotes(newVotes);
                        }}
                    />
                </Stack>
            </td>
            <td>
                {" "}
                <Stack align="center">
                    {" "}
                    <Radio
                        color="red"
                        size="md"
                        name={Object.keys(answer)[0]}
                        checked={votes[Object.keys(answer)[0]] === "WRONG" || Object.values(answer)[0] === "-"}
                        onChange={() => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = "WRONG";
                            setVotes(newVotes);
                        }}
                    />
                </Stack>
            </td>
        </tr>
    ));

    const styles = {
        tableHeader: {
            textAlign: "center",
            color: "black",
            fontStyle: "italic",
        },
    };

    let contentVotes = (
        <Stack
            align="center"
            sx={{ marginTop: "5%" }}
        >
            {" "}
            <Loader />{" "}
        </Stack>
    );
    if (answersToRate && answersToRate.length > 0) {
        contentVotes = (
            <Table
                verticalSpacing="md"
                fontSize="md"
            >
                <thead>
                    <tr>
                        <th></th>
                        <th style={styles.tableHeader}>perfect</th>
                        <th style={styles.tableHeader}>duplicate</th>
                        <th style={styles.tableHeader}>wrong</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        );
    }

    return (
        <BaseContainer>
            <SockJsClient
                url={SOCKET_URL}
                topics={[`/topic/lobbies/${gamePin}`]}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={(msg) => onMessageReceived(msg)}
                debug={false}
            />
            <Text color="white">Time remaining: {timer}</Text>
            <Title color="white">{StorageManager.getUsername()}</Title>
            <Text
                align="center"
                color="white"
                size="lg"
            >
                please rate the other answers:
            </Text>

            <Paper
                shadow="xl"
                radius="md"
                p="lg"
                sx={{ background: "azure", minWidth: "70%" }}
            >
                <Title align="center">
                    {category} ({letter})
                </Title>{" "}
                <Text
                    align="center"
                    sx={{ marginTop: "1%", marginBottom: "2%" }}
                >
                    your answer: <strong> {answer} </strong>
                </Text>
                {contentVotes}
                <Text
                    size="xs"
                    sx={{ marginTop: "3%" }}
                >
                    <strong> *perfect:</strong> this answer is correct & unique
                </Text>
                <Text size="xs">
                    <strong> *duplicate:</strong> this answer is correct but not unique
                </Text>
                <Text size="xs">
                    <strong> *wrong:</strong> this answer is rubbish
                </Text>
            </Paper>
            <StandardButton
                sx={{ marginTop: "5%" }}
                disabled={disableDoneButton || skipped}
                onClick={() => doSkipButton()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Voting;
