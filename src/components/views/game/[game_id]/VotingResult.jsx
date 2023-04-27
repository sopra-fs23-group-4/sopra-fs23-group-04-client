import { useParams } from "react-router-dom";
import BaseContainer from "../../../ui/BaseContainer";
import React, { useEffect } from "react";
import { Paper, Table, Text, Title } from "@mantine/core";
import { Check, Equal, LetterX } from "tabler-icons-react";
import { storageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";
import SockJsClient from "react-stomp";
import { handleError, RestApi } from "../../../../helpers/RestApi";

const VotingResult = () => {
    const SOCKET_URL = "http://localhost:8080/ws-message";
    const { gamePin, round, categoryIndex } = useParams();

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
        },
        {
            username: "skavnir",
            answerString: "Amsterdam",
            numberOfUnique: 0,
            numberOfNotUnique: 1,
            numberOfWrong: 2,
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
        <tr key={index}>
            <td>
                <strong> {result.username}</strong>
            </td>
            <td>{result.answerString}</td>
            <td>
                <strong>{result.username}</strong>{" "}
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

    let onMessageReceived = (msg) => {
        console.log(msg);
    };

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
