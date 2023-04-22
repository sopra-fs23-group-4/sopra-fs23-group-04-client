import BaseContainer from "../../ui/BaseContainer";
import StandardButton from "../../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { Container, SegmentedControl, Slider, Space, Title } from "@mantine/core";
import React, { useState } from "react";

const Settings = () => {
    const history = useHistory();
    const [rounds, setRounds] = useState(15);
    const [roundLength, setRoundLength] = useState("short");

    const MARKS = [
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 15, label: "15" },
        { value: 20, label: "20" },
    ];

    const createLobby = () => {
        // API Call etc.
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
                    { label: "short", value: "short" },
                    { label: "normal", value: "normal" },
                    { label: "loooong", value: "long" },
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
