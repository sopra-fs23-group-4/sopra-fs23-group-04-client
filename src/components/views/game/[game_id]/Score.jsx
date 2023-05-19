import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text, Stack, Paper, Container, Group } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import { Player } from "./Lobby";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { StorageManager as storageManager, StorageManager } from "../../../../helpers/storageManager";
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

    const history = useHistory();
    const [timer, setTimer] = useState(null);

    const [userScores, setUserScores] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (userScores.length === 0) {
                    // real code
                    let scoreResponse = await RestApi.getScores(gamePin);
                    setUserScores(scoreResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
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
        console.log("Websocket msg Score Page:");
        console.log(msg);
        if (msg.type === "roundStart") {
            StorageManager.setAnswers(Array(StorageManager.getCategories().length).fill(null));
            StorageManager.setLetter(msg.letter);
            StorageManager.setRound(msg.round);
            history.replace(`/game/${gamePin}/round/${msg.round}/countdown/`);
        } else if (msg.type === "scoreboardTimer") {
            setTimer(msg.timeRemaining);
        }
    };

    // Methods
    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            history.replace(`/game`);
        } catch (error) {
            console.error(`Something went wrong leaving the game: \n${handleError(error)}`);
        }
    }

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
        const sortedUsers = userScores.sort((a, b) => b.score - a.score);

        // Assign ranks to the users
        let rank = 1;
        let previousScore = null;
        const usersWithRanks = sortedUsers.map((user, index) => {
            if (user.score !== previousScore) {
                rank = index + 1;
                user.rank = rank;
            } else {
                user.rank = rank;
            }
            previousScore = user.score;
            return user;
        });

        scoreboardContent = (
            <Stack
                justify="flex-start"
                align="stretch"
                spacing="sm"
            >
                {usersWithRanks.map((user) => (
                    <ScoreboardEntry
                        key={user.username}
                        username={user.username}
                        number={user.rank}
                        score={user.score}
                    />
                ))}
            </Stack>
        );
    }

    let leaveButton = (
        <StandardButton
            sx={{ marginTop: "50%" }}
            color="pink"
            onClick={() => doLeave()}
        >
            give up
        </StandardButton>
    );
    if (storageManager.getRound() === storageManager.getRoundAmount()) {
        leaveButton = (
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => doLeave()}
            >
                leave
            </StandardButton>
        );
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
            <Text color="white">time remaining: {timer}</Text>
            <Title color="white">score</Title>
            <Paper
                radius="md"
                shadow="xl"
                p="lg"
                bg="rgba(0, 255, 0, .1)"
                sx={{ background: "inherit", minWidth: "220px", border: "3px solid azure" }}
            >
                {scoreboardContent}
            </Paper>
            <Text
                color="white"
                align="center"
                sx={{ width: "95%" }}
            >
                <b>random fact: </b>
                {StorageManager.getFact()}
            </Text>
            {leaveButton}
        </BaseContainer>
    );
};

export default Score;
