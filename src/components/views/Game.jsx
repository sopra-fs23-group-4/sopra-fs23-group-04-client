import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../api/RestApi";
import React, { useEffect, useState } from "react";
import { Flex, Modal, PinInput, Text, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { StorageManager } from "../../helpers/storageManager";
import TopTitle from "../ui/TopTitle";
import { useDisclosure } from "@mantine/hooks";

const Game = () => {
    const history = useHistory();

    const [pin, setPin] = useState("");
    const [rejoinGamePin, setRejoinGamePin] = useState(0);

    const [opened, { toggle, close }] = useDisclosure(false);

    useEffect(() => {
        const fetchData = () => {
            if (rejoinGamePin === 0) {
                RestApi.rejoinPossible()
                    .then((response) => {
                        setRejoinGamePin(response.gamePin);
                        if (response.rejoinPossible) {
                            toggle();
                        }
                    })
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the active game data: \n${handleError(error)}`);
                    });
            }
        };
        fetchData();
    }, [rejoinGamePin, toggle]);

    const handlePinChange = (newValue) => {
        setPin(newValue);
    };

    const fetchGameData = async (pin) => {
        try {
            const categoriesResponse = await RestApi.getGameCategories(pin);
            StorageManager.setCategories(categoriesResponse);

            const gameSettingsResponse = await RestApi.getGameSettings(pin);
            StorageManager.setRoundLength(gameSettingsResponse.roundLength);
            StorageManager.setRoundAmount(gameSettingsResponse.rounds);
        } catch (error) {
            console.error(`Something went wrong fetching the game settings: \n${handleError(error)}`);
        }
    };

    const doJoin = async (pin) => {
        try {
            await RestApi.joinGame(pin);
            await fetchGameData(pin);

            history.push(`/game/${pin}/lobby`);
        } catch (error) {
            console.error(`Something went wrong joining the lobby: \n${handleError(error)}`);
        }
    };

    const doRejoin = async (pin) => {
        try {
            const currentGameRound = await RestApi.rejoinGame(pin);
            await fetchGameData(pin);

            if (currentGameRound === 0) {
                history.push(`/game/${pin}/lobby`);
            } else {
                history.push(`/game/${pin}/round/${currentGameRound}/score`);
            }
        } catch (error) {
            console.error(`Something went wrong rejoining the game: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <TopTitle>game center</TopTitle>
            <Text color="white">create a new Game as HOST:</Text>
            <StandardButton onClick={() => history.push("/game/categories")}>create game</StandardButton>
            <Text
                color="white"
                sx={{ marginTop: "2%" }}
            >
                Join existing Game with PIN:
            </Text>
            <PinInput onChange={handlePinChange} />
            <StandardButton
                disabled={pin.length !== 4}
                onClick={() => doJoin(pin)}
            >
                join game
            </StandardButton>
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => history.push("/dashboard")}
            >
                back
            </StandardButton>
            <Modal
                opened={opened}
                onClose={close}
                title={<Title order={3}>You are still in a running game!</Title>}
                size="auto"
                closeOnClickOutside={false}
                closeOnEscape={false}
                withCloseButton={false}
                padding="xl"
                overlayProps={{
                    opacity: 0.55,
                    blur: 3,
                }}
                transition="scale"
                transitionDuration={300}
                transitionTimingFunction="ease"
                radius="md"
                yOffset="30vh"
                xOffset={0}
            >
                <Flex
                    gap="lg"
                    justify="center"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <StandardButton
                        onClick={() => {
                            RestApi.leaveGame(rejoinGamePin)
                                .then(() => {})
                                .catch(() => {});
                            toggle();
                        }}
                    >
                        leave game
                    </StandardButton>
                    <StandardButton
                        data-autofocus
                        onClick={() => doRejoin(rejoinGamePin)}
                    >
                        rejoin game
                    </StandardButton>
                </Flex>
            </Modal>
        </BaseContainer>
    );
};

export default Game;
