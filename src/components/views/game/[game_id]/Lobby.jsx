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

    const [message, setMessage] = useState("You server message here.");
    const [hostUsername, setHostUsername] = useState("");
    const [usersInLobby, setUsersInLobby] = useState([]);
    const [fetchedCategorys, setfetchedCategorys] = useState([]);

    let onConnected = () => {
        console.log("Connected!!");
    };
    let disconnect = () => {
        console.log("disconnect");
    };

    let onMessageReceived = (msg) => {
        if (msg.type === "gameUsers") {
            console.log("message with type gameUsers arrives");
            console.log(msg);
            // if (hostUsername !== msg.hostusrname)
            //setHostUsername(msg.hostusername);
            //setUsersInLobby(msg.usernames);
        } else if (msg.type === "startGame") {
            // storageManager.setAnswers(Array(msg.categories.length).fill(null));
            // storageManager.setLetter(msg.letter);
            // storageManager.setCategories(msg.categories);
            // history.push(`/game/${gamePin}/round/${1}/board/`);
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
                // update userList and check if Host value has changed
                if (hostUsername === storageManager.getUsername()) {
                    storageManager.setRole(Role.HOST);
                } else {
                    storageManager.setRole(Role.PLAYER);
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
                onDisconnect={disconnect()}
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
            <div>{message}</div>
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
