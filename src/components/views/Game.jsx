import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../helpers/RestApi";
import React, { useState } from "react";
import { PinInput, Title, Text } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Role, StorageManager } from "../../helpers/storageManager";

const Game = () => {
    const history = useHistory();

    const [pin, setPin] = useState("");

    const handlePinChange = (newValue) => {
        setPin(newValue);
    };

    const doJoin = async (pin) => {
        try {
            await RestApi.joinGame(pin);
            StorageManager.setRole(Role.PLAYER);
            StorageManager.setGamePin(pin);

            const categoriesResponse = await RestApi.getGameCategories(pin);
            StorageManager.setCategories(categoriesResponse);

            const gameSettingsResponse = await RestApi.getGameSettings(pin);
            StorageManager.setRoundLength(gameSettingsResponse.roundLength);
            StorageManager.setRoundAmount(gameSettingsResponse.rounds);

            history.push(`/game/${pin}/lobby`);
        } catch (error) {
            console.error(`Something went wrong joining the lobby: \n${handleError(error)}`);
        }
    };

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
                join game{"   "}
            </StandardButton>
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
