import BaseContainer from "../../../ui/BaseContainer";
import { Title, Stack, Paper, Container, Group } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import { Player } from "./Lobby";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { Role, storageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";

export const ScoreboardEntry = (props) => {
    return (
        <Group position="apart">
            <Player
                username={props.username}
                number={props.number}
            />
            <Title
                color="white"
                order={3}
            >
                {props.score}
            </Title>
        </Group>
    );
};

const Score = (props) => {
    const SOCKET_URL = getDomain() + "/ws-message";

    const gamePin = props.match.params["gamePin"];
    const round = props.match.params["round"];

    const history = useHistory();

    const [userScores, setUserScores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (userScores.length === 0) {
                    // hardcoded sample values
                    setUserScores([
                        {
                            username: "Günter",
                            score: 1500,
                        },
                        {
                            username: "Rüdiger",
                            score: 600,
                        },
                        {
                            username: "Ueli",
                            score: 2000,
                        },
                        {
                            username: "Thorsten",
                            score: 420,
                        },
                    ]);

                    // real code
                    // const scoreResponse = await RestApi.getScores(gamePin);
                    // setUserScores(scoreResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [userScores, gamePin]);

    // Websocket
    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };
    let onMessageReceived = (msg) => {
        console.log("Websocket msg:");
        console.log(msg);
        if (msg.type === "letter") {
            storageManager.setAnswers(Array(storageManager.getCategories().length).fill(null));
            storageManager.setLetter(msg.letter);
            storageManager.setRound(msg.round);
            history.push(`/game/${gamePin}/round/${msg.round}/board/`);
        }
    };

    // Scoreboard
    let scoreboardContent = (
        <Container align="center">
            <Title
                order={3}
                color="white"
            >
                loading...
            </Title>
        </Container>
    );

    if (userScores.length !== 0) {
        userScores.sort((a, b) => b.score - a.score);

        scoreboardContent = (
            <Stack
                justify="flex-start"
                align="stretch"
                spacing="sm"
            >
                {userScores.map((user, index) => (
                    <ScoreboardEntry
                        key={user.username}
                        username={user.username}
                        number={index + 1}
                        score={user.score}
                    />
                ))}
            </Stack>
        );
    }

    // Next Round Button
    const nextRound = async () => {
        await RestApi.startRound(gamePin, round + 1);
    };

    let nextRoundButton;
    if (storageManager.getRole() === Role.HOST) {
        nextRoundButton = <StandardButton onClick={() => nextRound()}>Next Round</StandardButton>;
    } else {
        nextRoundButton = "";
    }

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
            <Title color="white">Score</Title>
            <Paper
                radius="md"
                shadow="xl"
                withBorder="true"
                p="lg"
                sx={{ background: "inherit", minWidth: "220px" }}
            >
                {scoreboardContent}
            </Paper>
            {nextRoundButton}
        </BaseContainer>
    );
};

export default Score;
