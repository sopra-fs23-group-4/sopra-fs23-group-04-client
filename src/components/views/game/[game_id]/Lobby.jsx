import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text, Flex, Stack, Paper, Container, Badge } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { Role, StorageManager } from "../../../../helpers/storageManager";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";

export const Player = (props) => {
    let value;
    if (props.number === undefined) {
        value = props.username;
    } else {
        value = props.number + ". " + props.username;
    }
    return (
        <Title
            color="white"
            order={3}
            {...props}
        >
            {value}
        </Title>
    );
};

const Lobby = (props) => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const gamePin = props.match.params["gamePin"];

    const history = useHistory();

    const [hostUsername, setHostUsername] = useState("loading...");
    const [usersInLobby, setUsersInLobby] = useState([]);

    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };

    let onMessageReceived = (msg) => {
        console.log("Websocket msg:");
        console.log(msg);
        if (msg.type === "gameUsers") {
            if (hostUsername !== msg.hostUsername) {
                setHostUsername(msg.hostUsername);
            }
            setUsersInLobby(msg.usernames);
        } else if (msg.type === "letter") {
            StorageManager.setAnswers(Array(StorageManager.getCategories().length).fill(null));
            StorageManager.setLetter(msg.letter);
            StorageManager.setRound(msg.round);
            StorageManager.setGamePin(gamePin);
            history.push(`/game/${gamePin}/round/${1}/board/`);
        }
    };

    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
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
                if (hostUsername === "loading...") {
                    const gameUsersResponse = await RestApi.getGameUsers(gamePin);
                    setUsersInLobby(gameUsersResponse.usernames);
                    setHostUsername(gameUsersResponse.hostUsername);
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }

                // update Role value in sessionStorage
                if (hostUsername !== "loading...") {
                    if (hostUsername === StorageManager.getUsername()) {
                        if (StorageManager.getRole() !== Role.HOST) {
                            StorageManager.setRole(Role.HOST);
                        }
                    } else if (StorageManager.getRole() !== Role.PLAYER) {
                        StorageManager.setRole(Role.PLAYER);
                    }
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [usersInLobby, hostUsername, gamePin]);

    let playerListContent = (
        <Container align="center">
            <Title
                order={3}
                color="white"
            >
                You are alone :(
            </Title>
        </Container>
    );
    if (usersInLobby.length !== 0) {
        playerListContent = (
            <Stack
                justify="flex-start"
                align="center"
                spacing="sm"
            >
                {usersInLobby.map((username) => {
                    let color = "white";
                    if (username === StorageManager.getUsername()) {
                        color = "green";
                    }
                    return (
                        <Player
                            key={username}
                            color={color}
                            //onClick={() => history.push(`/users/${user.id}`)}
                            username={username}
                        />
                    );
                })}
            </Stack>
        );
    }

    let startGameButton;

    if (StorageManager.getRole() === Role.HOST) {
        startGameButton = (
            <StandardButton
                onClick={() => startGame()}
                disabled={usersInLobby.length === 0}
            >
                Start Game
            </StandardButton>
        );
    } else {
        startGameButton = "";
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
            <Title color="white">PIN: {gamePin}</Title>
            <Stack
                align="center"
                sx={{ maxWidth: "65%", paddingBottom: "2%" }}
            >
                <Flex
                    justify="flex-start"
                    direction="row"
                    gap="xl"
                    wrap="wrap"
                >
                    <Text
                        color="white"
                        fw={500}
                        inline="true"
                    >
                        Rounds: {StorageManager.getRoundAmount()}
                    </Text>
                    <Text
                        color="white"
                        fw={500}
                        inline="true"
                    >
                        Time/Round: {StorageManager.getRoundLength()}
                    </Text>
                </Flex>
                <Flex
                    justify="flex-start"
                    direction="row"
                    gap="xs"
                    wrap="wrap"
                >
                    <Text
                        color="white"
                        fw={500}
                        inline="true"
                    >
                        Categories:
                    </Text>
                    {StorageManager.getCategories().map((category) => (
                        <Badge
                            color="green"
                            radius="md"
                            variant="filled"
                            key={category}
                        >
                            {category}
                        </Badge>
                    ))}
                </Flex>
            </Stack>
            {startGameButton}
            <Paper
                radius="md"
                shadow="xl"
                p="lg"
                bg="rgba(0, 255, 0, .1)"
                sx={{ background: "inherit", minWidth: "220px", border: "4px solid white" }}
            >
                <Flex
                    mih={50}
                    gap="md"
                    justify="center"
                    wrap="wrap"
                    direction="row"
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
                        color={StorageManager.getRole() === Role.HOST ? "green" : "white"}
                    />
                </Flex>
                {playerListContent}
            </Paper>
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => doLeave()}
            >
                Leave
            </StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
