import { useParams } from "react-router-dom";
import BaseContainer from "../../../ui/BaseContainer";
import React, { useEffect, useState } from "react";
import { Paper, Table, Text, Title } from "@mantine/core";
import { Check, Equal, LetterX } from "tabler-icons-react";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../api/RestApi";
import StandardButton from "../../../ui/StandardButton";

const VotingResult = (props) => {
    const { gamePin, round, categoryIndex } = useParams();

    const [timer, setTimer] = useState(null);

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const category = categories[categoryIndex];
    const [votes, setVotes] = useState([]);
    const [disableDoneButton, setDisableDoneButton] = useState(true);
    const [skipped, setSkipped] = useState(false);
    const [continueButtonText, setContinueButtonText] = useState("continue");

    useEffect(() => {
        function fetchData() {
            new Promise((resolve) => setTimeout(resolve, 1500))
                .then(() => RestApi.getVotes(gamePin, round, category))
                .then((response) => {
                    setVotes(response.data);
                })
                .catch((error) => {
                    console.error(`Something went wrong while fetching the votes: \n${handleError(error)}`);
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
        if (props.websocketMsg.type === "resultTimer") {
            setTimer(props.websocketMsg.timeRemaining);
        }
        // because this hook is only supposed to execute/rerender on a new Websocket call and use exclusively the state of the other variables at the given time,
        // it makes sense to disable the exhaustive dependency requirements:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.websocketMsg]);

    const rows = votes.map((result) => {
        let pointsComponent;
        if (result.points === 3) {
            pointsComponent = (
                <Check
                    size={20}
                    strokeWidth={3}
                    color={"green"}
                />
            );
        } else if (result.points === 1) {
            pointsComponent = (
                <Equal
                    size={20}
                    strokeWidth={3}
                    color={"orange"}
                />
            );
        } else if (result.points === 0) {
            pointsComponent = (
                <LetterX
                    size={20}
                    strokeWidth={3}
                    color={"red"}
                />
            );
        }

        return (
            <tr
                key={result.username}
                style={{
                    backgroundColor: result.username === StorageManager.getUsername() ? "lightblue" : "transparent",
                }}
            >
                <td>
                    <strong>{result.username}</strong>
                </td>
                <td>{result.answerString}</td>
                <td align="center">
                    <strong>{result.points}</strong>{" "}
                </td>
                <td align="center">{pointsComponent}</td>
            </tr>
        );
    });

    async function doSkipButton() {
        try {
            setSkipped(true);
            setContinueButtonText("waiting for others");
            await RestApi.skip(gamePin);
        } catch (error) {
            console.error(`Something went wrong to skip: \n${handleError(error)}`);
        }
    }

    const stylesCenter = {
        tableHeader: {
            textAlign: "center",
            color: "black",
            textDecoration: "underline",
        },
    };

    const stylesLeft = {
        tableHeader: {
            textAlign: "left",
            color: "black",
            textDecoration: "underline",
        },
    };

    return (
        <BaseContainer>
            <Text color="white">Time remaining: {timer}</Text>
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
                sx={{ overflowX: "auto", background: "azure", minWidth: "70%", maxWidth: "105%", marginBottom: "1%" }}
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
                            <th style={stylesCenter.tableHeader}>points</th>
                            <th style={stylesCenter.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </Paper>
            <StandardButton
                sx={{ marginTop: "5%" }}
                disabled={disableDoneButton || skipped}
                onClick={() => doSkipButton()}
            >
                {continueButtonText}
            </StandardButton>
        </BaseContainer>
    );
};

export default VotingResult;
