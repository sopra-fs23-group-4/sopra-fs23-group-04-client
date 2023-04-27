import BaseContainer from "../../../ui/BaseContainer";
import { Checkbox, Paper, Stack, Table, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { storageManager } from "../../../../helpers/storageManager";
import { handleError } from "../../../../helpers/RestApi";

const Voting = () => {
    const { gamePin, round, categoryIndex } = useParams();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const category = categories[categoryIndex];
    const answers = storageManager.getAnswers();
    const answer = answers[categoryIndex] ? answers[categoryIndex] : "none";
    const [answersCategory, setAnswersCategory] = useState([{ dummy: "" }]);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        const newDict = {};
        answersCategory.forEach((obj) => {
            const key = Object.keys(obj)[0];
            newDict[key] = null;
        });
        setVotes(newDict);
        console.log(votes);
    }, [answersCategory]);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                setAnswersCategory([{ 1: "Arbon" }, { 2: "Appenzell" }, { 4: "Neuenburg" }, { 23: "Nyon" }]);
            } catch (error) {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the categories! See the console for details.");
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const rows = answersCategory.map((answer) => (
        <tr key={Object.keys(answer)[0]}>
            <td>
                <strong>{Object.values(answer)[0]}</strong>{" "}
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Checkbox
                        color="violet"
                        onChange={(event) => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = event.target.checked ? "CORRECT_UNIQUE" : null;
                            setVotes(newVotes);
                        }}
                    />
                </Stack>
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Checkbox
                        color="orange"
                        onChange={(event) => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = event.target.checked ? "CORRECT_NOT_UNIQUE" : null;
                            setVotes(newVotes);
                        }}
                    />
                </Stack>
            </td>
            <td>
                {" "}
                <Stack align="center">
                    {" "}
                    <Checkbox
                        color="red"
                        value="WRONG"
                        onChange={(event) => {
                            const newVotes = { ...votes };
                            newVotes[Object.keys(answer)[0]] = event.target.checked ? "WRONG" : null;
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
            <Title
                color="white"
                size="80"
            >
                {letter} {gamePin} {round}
            </Title>
            <Text
                align="center"
                color="white"
                size="lg"
                fw={700}
            >
                please vote:
            </Text>

            <Paper
                shadow="xl"
                radius="md"
                p="lg"
                sx={{ background: "#00acee", minWidth: "70%" }}
            >
                <Title
                    align="center"
                    color="white"
                >
                    {category}
                </Title>{" "}
                <Text
                    align="center"
                    size="lg"
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
            </Paper>
        </BaseContainer>
    );
};

export default Voting;
