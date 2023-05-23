import BaseContainer from "../../../ui/BaseContainer";
import { Divider, Loader, Paper, Radio, Stack, Table, Text, Title } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import StandardButton from "../../../ui/StandardButton";

const Voting = (props) => {
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
        function fetchData() {
            new Promise((resolve) => setTimeout(resolve, 200))
                .then(() => RestApi.getAnswersForCategory(gamePin, round, category))
                .then((answers) => setAnswersToRate(answers))
                .catch((error) => {
                    console.error(`Something went wrong while fetching the answers: \n${handleError(error)}`);
                });
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

    // Websocket updates
    useEffect(() => {
        const handleWebsocketMsg = async (msg) => {
            if (msg.type === "votingEnd") {
                console.log(msg);
                if (done === false) {
                    setDone(true);
                    await doDone();
                }
            } else if (msg.type === "votingTimer") {
                setTimer(msg.timeRemaining);
            }
        };

        if (props.websocketMsg.type !== "null") {
            handleWebsocketMsg(props.websocketMsg)
                .then(() => {})
                .catch((error) => {
                    console.error(`Something went wrong processing the WebsocketMsg: \n${handleError(error)}`);
                });
        }
        // because this hook is only supposed to execute/rerender on a new Websocket call and use exclusively the state of the other variables at the given time,
        // it makes sense to disable the exhaustive dependency requirements:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.websocketMsg]);

    async function doDone() {
        try {
            await RestApi.postVotes(gamePin, round, category, votes);
            history.replace(`/game/${gamePin}/round/${round}/votingResults/${categoryIndex}`);
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
            color: "grey",
            fontStyle: "italic",
        },
    };

    let contentVotes = (
        <Stack
            align="center"
            sx={{ marginTop: "5%", margingBottom: "5%" }}
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
            <Text color="white">Time remaining: {timer}</Text>
            <Text
                align="center"
                color="white"
                size="lg"
                fw={700}
            >
                voting
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
                <Divider
                    size="xs"
                    label="your answer"
                    labelPosition="left"
                    color="grey"
                    labelProps={{ size: "md", color: "grey" }}
                    sx={{ marginTop: "5%", marginBottom: "-2%" }}
                />
                <Table
                    verticalSpacing="md"
                    fontSize="md"
                >
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>
                        {" "}
                        <tr>
                            <td>
                                <strong>{answer}</strong>{" "}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <>
                    <Divider
                        size="xs"
                        label="answers to rate"
                        labelPosition="left"
                        color="grey"
                        labelProps={{ size: "md", color: "grey" }}
                        sx={{ marginTop: "0%", marginBottom: "-2%" }}
                    />
                </>
                {contentVotes}
                <Text
                    size="xs"
                    color="grey"
                    sx={{ marginTop: "3%" }}
                >
                    <strong> *perfect:</strong> this answer is correct & unique
                </Text>
                <Text
                    size="xs"
                    color="grey"
                >
                    <strong> *duplicate:</strong> this answer is correct but not unique
                </Text>
                <Text
                    size="xs"
                    color="grey"
                >
                    <strong> *wrong:</strong> this answer is rubbish
                </Text>
            </Paper>
            <StandardButton
                sx={{ marginTop: "5%" }}
                disabled={disableDoneButton || skipped}
                onClick={() => doSkipButton()}
            >
                done
            </StandardButton>
        </BaseContainer>
    );
};

export default Voting;
