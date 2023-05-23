import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../helpers/RestApi";
import React, { useEffect, useState } from "react";
import { PinInput, Title, Text } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { StorageManager } from "../../helpers/storageManager";

const Game = () => {
    const history = useHistory();

    const [pin, setPin] = useState("");
    const [rejoinGamePin, setRejoinGamePin] = useState(0);
    const [rejoinPossible, setRejoinPossible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!rejoinPossible && rejoinGamePin === 0) {
                RestApi.rejoinPossible()
                    .then((response) => {
                        setRejoinPossible(response.rejoinPossible);
                        setRejoinGamePin(response.gamePin);
                    })
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the active game data: \n${handleError(error)}`);
                    });
            }
        };
        fetchData();
    }, [rejoinPossible, rejoinGamePin]);

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
            await RestApi.rejoinGame(pin);
            await fetchGameData(pin);

            history.push(`/game/${pin}/round/${StorageManager.getRound()}/score`);
        } catch (error) {
            console.error(`Something went wrong rejoining the game: \n${handleError(error)}`);
        }
    };

    let rejoinButton = "";
    if (rejoinPossible) {
        rejoinButton = (
            <StandardButton
                sx={{ marginTop: "2%" }}
                onClick={() => doRejoin(rejoinGamePin)}
            >
                rejoin running game
            </StandardButton>
        );
    }

    return (
        <BaseContainer>
            <Title color="white">{StorageManager.getUsername()}</Title>
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
            {rejoinButton}
            <StandardButton
                sx={{ marginTop: "10%" }}
                onClick={() => history.push("/dashboard")}
            >
                back
            </StandardButton>
        </BaseContainer>
    );
};

export default Game;
