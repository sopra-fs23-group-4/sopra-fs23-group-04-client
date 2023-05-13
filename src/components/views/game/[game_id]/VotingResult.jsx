import { useHistory, useParams } from "react-router-dom";
import BaseContainer from "../../../ui/BaseContainer";
import React, { useEffect, useState } from "react";
import { Paper, Table, Text, Title } from "@mantine/core";
import { Check, Equal, LetterX } from "tabler-icons-react";
import { StorageManager } from "../../../../helpers/storageManager";
import SockJsClient from "react-stomp";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { getDomain } from "../../../../helpers/getDomain";
import StandardButton from "../../../ui/StandardButton";

const VotingResult = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const { gamePin, round, categoryIndex } = useParams();
    const history = useHistory();

    const [timer, setTimer] = useState(null);

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const category = categories[categoryIndex];
    const [votes, setVotes] = useState([]);

    const [skipped, setSkipped] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await RestApi.getVotes(gamePin, round, category);
                console.log(response.data);
                setVotes(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the votes: \n${handleError(error)}`);
            }
        }
        fetchData();
    }, [gamePin, round, category]);

    const rows = votes.map((result, index) => {
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
                key={index}
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
        if (msg.type === "resultTimer") {
            setTimer(msg.timeRemaining);
        } else if (msg.type === "resultNextVote") {
            const nextCategoryIndex = parseInt(categoryIndex) + 1;
            history.push(`/game/${gamePin}/round/${round}/voting/${nextCategoryIndex}`);
        } else if (msg.type === "resultScoreboard") {
            history.push(`/game/${gamePin}/round/${round}/score`);
        } else if (msg.type === "resultWinner") {
            history.push(`/game/${gamePin}/winner`);
        }
    };

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
                disabled={skipped}
                onClick={() => doSkipButton()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default VotingResult;
