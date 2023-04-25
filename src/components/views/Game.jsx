import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../helpers/RestApi";
import React, { useState } from "react";
import { PinInput, Title, Text } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { storageManager } from "../../helpers/storageManager";

const Game = () => {
    const history = useHistory();

    const [pin, setPin] = useState("");

    const handlePinChange = (newValue) => {
        setPin(newValue);
    };

    const doJoin = async (pin) => {
        try {
            await RestApi.joinGame(pin);
            history.push(`/game/${pin}/lobby`);
        } catch (error) {
            alert(`Something went wrong joining the lobby: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Title color="white">{storageManager.getUsername()}</Title>
            <Text color="white">create a new Game as HOST:</Text>
            <StandardButton onClick={() => history.push("/game/categories")}>Create Game</StandardButton>
            <Text
                color="white"
                sx={{ marginTop: "2%" }}
            >
                Join existing Game with PIN:
            </Text>
            <PinInput onChange={handlePinChange} />
            <StandardButton onClick={() => doJoin(pin)}>Join Game{"   "}</StandardButton>
            <StandardButton
                sx={{ marginTop: "5%" }}
                onClick={() => history.push("/dashboard")}
            >
                Back
            </StandardButton>
        </BaseContainer>
    );
};

export default Game;
