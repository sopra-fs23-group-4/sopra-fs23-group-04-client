import BaseContainer from "../../../ui/BaseContainer";
import { Title, Flex, Stack, Paper, Container } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { Role, storageManager } from "../../../../helpers/storageManager";
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
            storageManager.setAnswers(Array(storageManager.getCategories().length).fill(null));
            storageManager.setLetter(msg.letter);
            storageManager.setRound(msg.round);
            storageManager.setGamePin(gamePin);
            history.push(`/game/${gamePin}/round/${1}/board/`);
        }
    };

    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            storageManager.resetRound();
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

                // update sessionStorage
                // Role
                if (hostUsername !== "loading...") {
                    if (hostUsername === storageManager.getUsername()) {
                        if (storageManager.getRole() !== Role.HOST) {
                            storageManager.setRole(Role.HOST);
                        }
                    } else if (storageManager.getRole() !== Role.PLAYER) {
                        storageManager.setRole(Role.PLAYER);
                    }
                }
                // Categories
                if (storageManager.getCategories().length === 0) {
                    const categoriesResponse = await RestApi.getGameCategories(gamePin);
                    storageManager.setCategories(categoriesResponse);
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

    let startGameButton;

    if (storageManager.getRole() === Role.HOST) {
        startGameButton = <StandardButton onClick={() => startGame()}>Start Game</StandardButton>;
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
                radius="md"
                shadow="xl"
                withBorder="true"
                p="lg"
                sx={{ background: "inherit", minWidth: "220px", borderWidth: "thick" }}
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
            {startGameButton}
            <StandardButton onClick={() => doLeave()}>Leave</StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
