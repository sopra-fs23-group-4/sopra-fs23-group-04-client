import BaseContainer from "../../../ui/BaseContainer";
import { Paper, Radio, Stack, Table, Text, Title } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { storageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";

const Voting = () => {
    const SOCKET_URL = "http://localhost:8080/ws-message";
    const history = useHistory();
    const { gamePin, round, categoryIndex } = useParams();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const category = categories[categoryIndex];
    const answers = storageManager.getAnswers();
    const answer = answers[categoryIndex] ? answers[categoryIndex] : "none";
    const [answersCategory, setAnswersCategory] = useState([{ dummy: "" }]);
    //const [answersCategory, setAnswersCategory] = useState([{ 1: "Arbon" }, { 2: "Appenzell" }, { 4: "Neuenburg" }, { 23: "Nyon" }]);
    const [votes, setVotes] = useState({});

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
            console.log("hello");
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

    let onMessageReceived = (msg) => {
        console.log(msg);
        doDone();
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
                        icon="filled"
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
                        icon="filled"
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
                        icon="filled"
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
            <Title color="white">{storageManager.getUsername()}</Title>
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
                sx={{ background: "white", minWidth: "70%" }}
            >
                <Title align="center">
                    {category} ({letter})
                </Title>{" "}
                <Text
                    align="center"
                    size="lg"
                    sx={{ marginTop: "1%" }}
                >
                    your answer: <strong> {answer} </strong>
                </Text>
                <Table
                    striped
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
            </Paper>
        </BaseContainer>
    );
};

export default Voting;
