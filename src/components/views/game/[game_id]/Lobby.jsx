import BaseContainer from "../../../ui/BaseContainer";
import { Title, Flex, Stack, Paper, Loader, Container } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { storageManager } from "../../../../helpers/storageManager";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import SockJsClient from "react-stomp";

const Player = (props) => (
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
    const [users, setUsers] = useState([]);

    let onConnected = () => {
        console.log("Connected!!");
    };
    let disconnect = () => {
        console.log("disconnect");
    };

    let onMessageReceived = (msg) => {
        setMessage(msg.type);
    };

    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong leaving the lobby: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUsers = await RestApi.getUsers();
                console.log(responseUsers);
                setUsers(responseUsers);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let content = (
        <Container align="center">
            <Loader />
        </Container>
    );
    if (users.length !== 0) {
        content = (
            <Stack
                justify="flex-start"
                align="center"
                spacing="sm"
            >
                {users.map((user) => (
                    <Player
                        key={user.id}
                        onClick={() => history.push(`/users/${user.id}`)}
                        username={user.username}
                    />
                ))}
            </Stack>
        );
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
                sx={{ background: "#00acee", minWidth: "70%" }}
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
                        username={storageManager.getUsername()}
                        onClick={() => console.log("click")}
                    />
                </Flex>
                {content}
            </Paper>
            <StandardButton onClick={() => doLeave()}>Leave</StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
