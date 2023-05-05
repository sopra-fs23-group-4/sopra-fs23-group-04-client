import { useHistory, useParams } from "react-router-dom";
import BaseContainer from "../../../ui/BaseContainer";
import React, { useEffect } from "react";
import { Paper, Table, Text, Title } from "@mantine/core";
import { Check, Equal, LetterX } from "tabler-icons-react";
import { storageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";
import SockJsClient from "react-stomp";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { getDomain } from "../../../../helpers/getDomain";

const VotingResult = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const { gamePin, round, categoryIndex } = useParams();
    const history = useHistory();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const category = categories[categoryIndex];
    const VotingResults = [
        {
            username: "wigeto",
            answerString: "Amsterdam",
            numberOfUnique: 0,
            numberOfNotUnique: 1,
            numberOfWrong: 2,
            points: 1,
        },
        {
            username: "skavnir",
            answerString: "Amsterdam",
            numberOfUnique: 0,
            numberOfNotUnique: 1,
            numberOfWrong: 2,
            points: 99,
        },
        {
            username: "a",
            answerString: "Amsterdam",
            numberOfUnique: 0,
            numberOfNotUnique: 1,
            numberOfWrong: 2,
            points: 1,
        },
        {
            username: "d",
            answerString: "Amsterdam",
            numberOfUnique: 0,
            numberOfNotUnique: 1,
            numberOfWrong: 2,
            points: 1,
        },
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                console.log(await RestApi.getVotes(gamePin, round, category));
            } catch (error) {
                console.error(`Something went wrong while fetching the votes: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the votes! See the console for details.");
            }
        }
        fetchData();
    }, [gamePin, round, category]);

    const rows = VotingResults.map((result, index) => (
        <tr
            key={index}
            style={{
                backgroundColor: result.username === storageManager.getUsername() ? "lightblue" : "transparent",
            }}
        >
            <td>
                <strong> {result.username}</strong>
            </td>
            <td>{result.answerString}</td>
            <td>
                <strong>{result.points}</strong>{" "}
            </td>
            <td align="center">{result.numberOfUnique}</td>
            <td align="center">{result.numberOfNotUnique}</td>
            <td align="center">{result.numberOfWrong}</td>
        </tr>
    ));

    let contentRole = null;
    if (storageManager.getRole() !== "player") {
        contentRole = <StandardButton>DONE</StandardButton>;
    }

    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };

    let onMessageReceived = async (msg) => {
        console.log(msg.type);
        if (msg.type === "resultNextVote") {
            const nextCategoryIndex = parseInt(categoryIndex) + 1;
            history.push(`/game/${gamePin}/round/${round}/voting/${nextCategoryIndex}`);
        } else if (msg.type === "resultScoreboard") {
            history.push(`/game/${gamePin}/round/${round}/scoreboard`);
        } else if (msg.type === "resultWinner") {
            history.push(`/game/${gamePin}/round/${round}/winner`);
        }
    };

    const stylesCenter = {
        tableHeader: {
            textAlign: "center",
            color: "black",
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
                sx={{ background: "azure", minWidth: "70%" }}
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
