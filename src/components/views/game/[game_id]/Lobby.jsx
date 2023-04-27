import BaseContainer from "../../../ui/BaseContainer";
import { Title, Flex, Stack, Paper, Loader, Container, Group } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { Role, storageManager } from "../../../../helpers/storageManager";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";

export const Player = (props) => (
    <Title
        color="white"
        order={3}
        {...props}
    >
        {props.username}
    </Title>
);

const Lobby = (props) => {
    const SOCKET_URL = "http://localhost:8080/ws-message";
    const gamePin = props.match.params["gamePin"];

    const history = useHistory();

    const [hostUsername, setHostUsername] = useState("");
    const [usersInLobby, setUsersInLobby] = useState([]);

    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };

    let onMessageReceived = (msg) => {
        console.log(msg);
        if (msg.type === "gameUsers") {
            if (hostUsername !== msg.hostUsername) {
                setHostUsername(msg.hostUsername);
            }
            setUsersInLobby(msg.usernames);
        } else if (msg.type === "startGame") {
            storageManager.setAnswers(Array(storageManager.getCategories().length).fill(null));
            storageManager.setLetter(msg.letter);
            history.push(`/game/${gamePin}/round/${1}/board/`);
        }
    };

    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            sessionStorage.removeItem("categories");
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong leaving the lobby: \n${handleError(error)}`);
        }
    }

    async function startGame() {
        try {
            await RestApi.startGame(gamePin);
        } catch (error) {
            alert(`Something went wrong starting the game: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if (storageManager.getRole() === Role.HOST) {
                    setHostUsername(storageManager.getUsername);
                }
                // update sessionStorage
                // Role
                if (hostUsername === storageManager.getUsername()) {
                    if (storageManager.getRole() !== Role.HOST) {
                        storageManager.setRole(Role.HOST);
                    }
                } else if (storageManager.getRole() !== Role.PLAYER) {
                    storageManager.setRole(Role.PLAYER);
                }
                // Categories
                if (storageManager.getCategories().length === 0) {
                    const response = await RestApi.getGameCategories(gamePin);
                    storageManager.setCategories(response);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [usersInLobby, hostUsername]);

    let playerListContent = (
        <Container align="center">
            <Loader />
        </Container>
    );
    if (usersInLobby.length !== 0) {
        playerListContent = (
            <Stack
                justify="flex-start"
                align="center"
                spacing="sm"
            >
                {usersInLobby.map((username) => (
                    <Player
                        key={username}
                        //onClick={() => history.push(`/users/${user.id}`)}
                        username={username}
                    />
                ))}
            </Stack>
        );
    }

    let startGameButton = " ";

    if (storageManager.getRole() === Role.HOST) {
        startGameButton = <StandardButton onClick={() => startGame()}>Start Game</StandardButton>;
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
            <Flex
                mih={50}
                gap="md"
                justify="center"
                wrap="wrap"
            >
                <Title color="white">PIN:</Title>
                <Title color="white">{gamePin}</Title>
            </Flex>
            <Paper
                shadow="xl"
                radius="md"
                p="lg"
                sx={{ background: "#00acee", minWidth: "220px" }}
            >
                <Flex
                    mih={50}
                    gap="md"
                    justify="center"
                    wrap="wrap"
                >
                    <Title
                        order={3}
                        color="white"
                    >
                        Host:
                    </Title>
                    <Player
                        username={hostUsername}
                        onClick={() => console.log("click")}
                    />
                </Flex>
                {playerListContent}
            </Paper>
            <Group sx={{ paddingTop: "5%" }}>
                <StandardButton onClick={() => doLeave()}>Leave</StandardButton>
                {startGameButton}
            </Group>
        </BaseContainer>
    );
};

export default Lobby;
