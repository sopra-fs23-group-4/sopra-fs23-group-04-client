import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text, Stack, Paper, Container, Group } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import { Player } from "./Lobby";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { StorageManager } from "../../../../helpers/storageManager";
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

    const [userScores, setUserScores] = useState([]);
    const [fact, setFact] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                if (userScores.length === 0) {
                    // real code
                    let scoreResponse = await RestApi.getScores(gamePin);
                    setUserScores(scoreResponse);
                }
                if (fact === "") {
                    const factResponse = await RestApi.generateFact();
                    console.log(factResponse);
                    setFact(factResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the scores! See the console for details.");
            }
        }
        fetchData();
    }, [userScores, fact, gamePin]);

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
            StorageManager.setAnswers(Array(StorageManager.getCategories().length).fill(null));
            StorageManager.setLetter(msg.letter);
            StorageManager.setRound(msg.round);
            history.push(`/game/${gamePin}/round/${msg.round}/board/`);
        }
    };

    // Methods
    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong leaving the game: \n${handleError(error)}`);
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

    // let leaveButton = "";
    // if (storageManager.getRound() === storageManager.getRoundAmount()) {
    //     leaveButton = <StandardButton onClick={() => doLeave()}>Leave</StandardButton>;
    // }

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
                p="lg"
                bg="rgba(0, 255, 0, .1)"
                sx={{ background: "inherit", minWidth: "220px", border: "4px solid white" }}
            >
                {scoreboardContent}
            </Paper>
            <Text
                color="white"
                align="center"
                sx={{ width: "95%" }}
            >
                <b>Random Fact: </b>
                {fact}
            </Text>
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => doLeave()}
            >
                Leave
            </StandardButton>
        </BaseContainer>
    );
};

export default Score;
