import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text, Stack, Container, Group, Progress, Space, Modal, Flex } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Player } from "./Lobby";
import { handleError, RestApi } from "../../../../api/RestApi";
import { StorageManager as storageManager, StorageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";
import { useDisclosure } from "@mantine/hooks";
import TopTitle from "../../../ui/TopTitle";
import PaperBox from "../../../ui/PaperBox";

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
    const gamePin = props.match.params["gamePin"];

    const [opened, { toggle, close }] = useDisclosure(false);
    const history = useHistory();
    const [timer, setTimer] = useState(0);

    const [userScores, setUserScores] = useState([]);

    useEffect(() => {
        function fetchData() {
            if (userScores.length === 0) {
                RestApi.getScores(gamePin)
                    .then((scoreResponse) => setUserScores(scoreResponse))
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
                    });
            }
        }
        fetchData();
    }, [userScores, gamePin]);

    // Websocket updates
    useEffect(() => {
        if (props.websocketMsg.type === "scoreboardTimer") {
            setTimer(props.websocketMsg.timeRemaining);
        }
    }, [props.websocketMsg]);

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
            sx={{
                marginTop: "20%",
                "&:disabled": {
                    color: "inherit",
                    backgroundColor: "#e4487f",
                    opacity: 0.5,
                },
            }}
            color="pink"
            onClick={toggle}
            disabled={opened}
        >
            give up
        </StandardButton>
    );
    if (storageManager.getRound() === storageManager.getRoundAmount()) {
        leaveButton = (
            <StandardButton
                sx={{ marginTop: "5%" }}
                onClick={() => {
                    StorageManager.resetGame();
                    history.replace(`/game`);
                }}
            >
                leave
            </StandardButton>
        );
    }

    return (
        <BaseContainer>
            <Text color="white">time remaining: {timer}</Text>
            <TopTitle style={{ color: "white", marginTop: "-3%" }}>score</TopTitle>
            <PaperBox p="lg">{scoreboardContent}</PaperBox>
            <Space />
            <Stack
                align="stretch"
                justify="center"
                spacing="5px"
                sx={{ minWidth: "80%" }}
            >
                <Text
                    color="white"
                    align="center"
                    inline
                >{`Round: ${StorageManager.getRound()} / ${storageManager.getRoundAmount()}`}</Text>
                <Progress
                    color="teal"
                    size="lg"
                    radius="xl"
                    value={(StorageManager.getRound() / StorageManager.getRoundAmount()) * 100}
                />
            </Stack>
            <Space />
            <Text
                color="white"
                align="center"
                sx={{ width: "95%" }}
            >
                <b>random fact: </b>
                {StorageManager.getFact()}
            </Text>
            {leaveButton}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Text
                        fw={700}
                        fz="15pt"
                    >
                        Whaaat?!
                        <br />
                        Do you really want to be a loser?
                    </Text>
                }
                withCloseButton={false}
                size="auto"
                padding="xl"
                radius="md"
                yOffset="30vh"
                xOffset={0}
                overlayProps={{
                    opacity: 0.55,
                    blur: 3,
                }}
                transitionProps={{
                    transition: "slide-up",
                    duration: 300,
                    timingFunction: "ease-out",
                }}
            >
                <Flex
                    gap="xl"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                    mt="2%"
                >
                    <StandardButton
                        color="green"
                        data-autofocus
                        onClick={close}
                    >
                        stay
                    </StandardButton>
                    <StandardButton
                        color="red"
                        onClick={() => doLeave()}
                    >
                        leave :(
                    </StandardButton>
                </Flex>
            </Modal>
        </BaseContainer>
    );
};

export default Score;
