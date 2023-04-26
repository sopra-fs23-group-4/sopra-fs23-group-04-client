import BaseContainer from "../../../ui/BaseContainer";
import { Checkbox, Paper, Stack, Table, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { storageManager } from "../../../../helpers/storageManager";

const Voting = () => {
    const { categoryIndex } = useParams();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const category = categories[categoryIndex];
    const answers = storageManager.getAnswers();
    const answer = answers[categoryIndex] ? answers[categoryIndex] : "none";
    const [answersCategory] = useState(["Amsterdam", "Kölle", "Aarau"]);

    const rows = answersCategory.map((answer) => (
        <tr key={answer}>
            <td>
                <strong>{answer}</strong>{" "}
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Checkbox checked="true" />
                </Stack>
            </td>
            <td>
                <Stack align="center">
                    {" "}
                    <Checkbox />
                </Stack>
            </td>
            <td>
                {" "}
                <Stack align="center">
                    {" "}
                    <Checkbox />
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
                {letter}
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
                            <th style={styles.tableHeader}>double</th>
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
