import BaseContainer from "../../ui/BaseContainer";
import StandardButton from "../../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { Container, SegmentedControl, Slider, Space, Title } from "@mantine/core";
import React, { useState } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { Role, StorageManager } from "../../../helpers/storageManager";

export const RoundLength = {
    SHORT: "SHORT",
    MEDIUM: "MEDIUM",
    LONG: "LONG",
};
export const roundLengthInSeconds = {
    [RoundLength.SHORT]: "30s",
    [RoundLength.MEDIUM]: "60s",
    [RoundLength.LONG]: "90s",
};

const Settings = () => {
    const history = useHistory();
    const [rounds, setRounds] = useState(5);
    const [roundLength, setRoundLength] = useState(RoundLength.MEDIUM);

    const MARKS = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 15, label: "15" },
        { value: 20, label: "20" },
    ];

    const createLobby = async () => {
        try {
            let categories = StorageManager.getCategoriesSelected();
            const pin = await RestApi.createGame(rounds, roundLength, categories);
            StorageManager.removeCategoriesSelected();
            StorageManager.setRole(Role.HOST);
            StorageManager.setRoundAmount(rounds);
            StorageManager.setRoundLength(roundLength);
            StorageManager.setCategories(categories);
            StorageManager.setGamePin(pin);
            history.push(`/game/${pin}/lobby`);
        } catch (error) {
            console.error(`Something went wrong whilst creating the lobby: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Title color="white">
                Rounds: <b>{rounds}</b>
            </Title>
            <Container sx={{ minWidth: "60%" }}>
                <Slider
                    sx={{ marginTop: "5%", "& .mantine-Slider-markLabel": { color: "white" } }}
                    defaultValue={15}
                    min={1}
                    max={26}
                    marks={MARKS}
                    value={rounds}
                    onChange={setRounds}
                />
            </Container>
            <Space h="xs" />
            <Title color="white">
                Round Length: <b>{roundLengthInSeconds[roundLength]}</b>
            </Title>
            <SegmentedControl
                color="blue"
                data={[
                    { label: "short", value: RoundLength.SHORT },
                    { label: "normal", value: RoundLength.MEDIUM },
                    { label: "long", value: RoundLength.LONG },
                ]}
                value={roundLength}
                onChange={setRoundLength}
            />
            <Space h="xs" />
            <StandardButton onClick={createLobby}>create lobby</StandardButton>
            <Space h="md" />
            <StandardButton
                sx={{ marginTop: "10%" }}
                component={Link}
                to="/game/categories"
            >
                back
            </StandardButton>
        </BaseContainer>
    );
};

export default Settings;
