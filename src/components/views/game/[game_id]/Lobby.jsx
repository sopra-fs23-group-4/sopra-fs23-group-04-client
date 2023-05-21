import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text, Flex, Stack, Paper, Container, Badge } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { Role, StorageManager } from "../../../../helpers/storageManager";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../../helpers/RestApi";

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
    const gamePin = props.match.params["gamePin"];

    const history = useHistory();

    const [hostUsername, setHostUsername] = useState(props.hostUsername);
    const [usersInLobby, setUsersInLobby] = useState(props.usersInLobby);

    async function doLeave() {
        try {
            await RestApi.leaveGame(gamePin);
            history.replace(`/game`);
        } catch (error) {
            console.error(`Something went wrong leaving the lobby: \n${handleError(error)}`);
        }
    }

    async function startGame() {
        try {
            await RestApi.startGame(gamePin);
        } catch (error) {
            console.error(`Something went wrong starting the game: \n${handleError(error)}`);
        }
    }

    useEffect(() => {
        if (props.hostUsername !== "loading...") {
            console.log("prop useEffect trigger");
            setHostUsername(props.hostUsername);
            setUsersInLobby(props.usersInLobby);
        }
    }, [props.hostUsername, props.usersInLobby]);

    useEffect(() => {
        const fetchData = () => {
            if (hostUsername === "loading...") {
                RestApi.getGameUsers(gamePin)
                    .then((gameUsersResponse) => {
                        setUsersInLobby(gameUsersResponse.usernames);
                        setHostUsername(gameUsersResponse.hostUsername);
                    })
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                    });
            }
            if (hostUsername !== "loading...") {
                if (hostUsername === StorageManager.getUsername()) {
                    if (StorageManager.getRole() !== Role.HOST) {
                        StorageManager.setRole(Role.HOST);
                    }
                } else if (StorageManager.getRole() !== Role.PLAYER) {
                    StorageManager.setRole(Role.PLAYER);
                }
            }
        };

        fetchData();
    }, [usersInLobby, hostUsername, gamePin]);

    let playerListContent = (
        <Container align="center">
            <Title
                order={3}
                color="white"
            >
                you are alone :(
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
                start game
            </StandardButton>
        );
    } else {
        startGameButton = "";
    }

    return (
        <BaseContainer>
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
                        rounds: {StorageManager.getRoundAmount()}
                    </Text>
                    <Text
                        color="white"
                        fw={500}
                        inline="true"
                    >
                        time/round: {StorageManager.getRoundLength()}
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
                        categories:
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
                sx={{ background: "inherit", minWidth: "220px", border: "3px solid azure" }}
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
                        host:
                    </Title>
                    <Player
                        username={hostUsername}
                        color={StorageManager.getRole() === Role.HOST ? "green" : "white"}
                    />
                </Flex>
                {playerListContent}
            </Paper>
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => doLeave()}
            >
                leave
            </StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
