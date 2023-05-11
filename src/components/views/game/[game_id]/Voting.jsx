import BaseContainer from "../../../ui/BaseContainer";
import { Paper, Radio, Stack, Table, Text, Title } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";

const Voting = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const history = useHistory();
    const { gamePin, round, categoryIndex } = useParams();

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const category = categories[categoryIndex];
    const answers = StorageManager.getAnswers();
    const answer = answers[categoryIndex] ? answers[categoryIndex] : "none";
    const [answersCategory, setAnswersCategory] = useState([{ dummy: "" }]);
    //const [answersCategory, setAnswersCategory] = useState([{ 1: "Arbon" }, { 2: "Appenzell" }, { 4: "Neuenburg" }, { 23: "Nyon" }]);
    const [votes, setVotes] = useState({});
    const [timer, setTimer] = useState(45);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const newDict = {};
        answersCategory.forEach((obj) => {
            const key = Object.keys(obj)[0];
            newDict[key] = null;
        });
        setVotes(newDict);
    }, [answersCategory]);

    useEffect(() => {
        async function fetchData() {
            try {
                setAnswersCategory(await RestApi.getAnswersForCategory(gamePin, round, category));
            } catch (error) {
                console.error(`Something went wrong while fetching the answers: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the answers! See the console for details.");
            }
        }
        fetchData();
    }, [gamePin, round, category]);

    async function doDone() {
        try {
            await RestApi.postVotes(gamePin, round, category, votes);
            history.push(`/game/${gamePin}/round/${round}/votingResults/${categoryIndex}`);
        } catch (error) {
            console.error(`Something went wrong while sending the votes: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while sending the votes! See the console for details.");
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

    const rows = answersCategory.map((answer) => (
        <tr key={Object.keys(answer)[0]}>
            <td>
                <strong>{Object.values(answer)[0]}</strong>{" "}
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Radio
                        color="green"
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
                        name={Object.keys(answer)[0]}
                        checked={votes[Object.keys(answer)[0]] === "WRONG"}
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
                please rate the answers:
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
                    sx={{ marginTop: "1%" }}
                >
                    your answer: <strong> {answer} </strong>
                </Text>
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
        </BaseContainer>
    );
};

export default Voting;
