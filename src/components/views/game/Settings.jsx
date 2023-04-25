import BaseContainer from "../../ui/BaseContainer";
import StandardButton from "../../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { Container, SegmentedControl, Slider, Space, Title } from "@mantine/core";
import React, { useState } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { storageManager } from "../../../helpers/storageManager";

const Settings = () => {
    const history = useHistory();
    const [rounds, setRounds] = useState(15);
    const [roundLength, setRoundLength] = useState("SHORT");

    const MARKS = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 15, label: "15" },
        { value: 20, label: "20" },
    ];

    const createLobby = async () => {
        try {
            let categories = storageManager.getCategoriesSelected();
            const pin = await RestApi.createGame(rounds, roundLength, categories);
            storageManager.removeCategoriesSelected();
            history.push(`/game/${pin}/lobby`);
        } catch (error) {
            alert(`Something went wrong whilst creating the lobby: \n${handleError(error)}`);
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
            <Title color="white">Round Length</Title>
            <SegmentedControl
                color="blue"
                data={[
                    { label: "short", value: "SHORT" },
                    { label: "normal", value: "MEDIUM" },
                    { label: "loooong", value: "LONG" },
                ]}
                value={roundLength}
                onChange={setRoundLength}
            />
            <Space h="xs" />
            <StandardButton onClick={createLobby}>Create Lobby</StandardButton>
            <Space h="md" />
            <StandardButton
                component={Link}
                to="/game/categories"
            >
                Back
            </StandardButton>
        </BaseContainer>
    );
};

export default Settings;
