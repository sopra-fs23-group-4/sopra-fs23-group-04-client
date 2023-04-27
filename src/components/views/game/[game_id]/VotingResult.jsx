import { useParams } from "react-router-dom";
import BaseContainer from "../../../ui/BaseContainer";
import React from "react";
import { Paper, Table, Text, Title } from "@mantine/core";
import { Check, Equal, LetterX } from "tabler-icons-react";
import { storageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";

const VotingResult = () => {
    const { categoryIndex } = useParams();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const category = categories[categoryIndex];
    const votingresults = [
        ["wigeto", "Amsterdam", 0, 3, 0, 1],
        ["skavnir", "Altnau", 3, 0, 0, 2],
        ["AlexBac ", "Amsterdam", 0, 3, 0, 1],
    ];

    const rows = votingresults.map((result, index) => (
        <tr key={index}>
            <td>
                <strong> {result[0]}</strong>
            </td>
            <td>{result[1]}</td>
            <td>
                <strong>{result[5]}</strong>{" "}
            </td>
            <td align="center">{result[2]}</td>
            <td align="center">{result[3]}</td>
            <td align="center">{result[4]}</td>
        </tr>
    ));

    let contentRole = null;
    if (storageManager.getRole() !== "player") {
        contentRole = <StandardButton>DONE</StandardButton>;
    }

    const stylesCenter = {
        tableHeader: {
            textAlign: "center",
            color: "black",
            fontStyle: "italic",
        },
    };

    const stylesLeft = {
        tableHeader: {
            textAlign: "left",
            color: "black",
        },
    };

    return (
        <BaseContainer>
            <Title color="white">{storageManager.getUsername()}</Title>
            <Text
                align="center"
                color="white"
                size="lg"
                fw={700}
            >
                voting results
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
                ></Text>
                <Table
                    striped
                    verticalSpacing="md"
                    fontSize="md"
                >
                    <thead>
                        <tr>
                            <th style={stylesLeft.tableHeader}>user</th>
                            <th style={stylesLeft.tableHeader}>answer</th>
                            <th style={stylesLeft.tableHeader}>points</th>
                            <th style={stylesCenter.tableHeader}>
                                <Check
                                    size={20}
                                    strokeWidth={3}
                                    color={"green"}
                                />{" "}
                            </th>
                            <th style={stylesCenter.tableHeader}>
                                <Equal
                                    size={20}
                                    strokeWidth={3}
                                    color={"orange"}
                                />{" "}
                            </th>
                            <th style={stylesCenter.tableHeader}>
                                <LetterX
                                    size={16}
                                    strokeWidth={3}
                                    color={"red"}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Paper>
            {contentRole}
        </BaseContainer>
    );
};

export default VotingResult;
