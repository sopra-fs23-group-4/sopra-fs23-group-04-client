import BaseContainer from "../../../ui/BaseContainer";
import React, { useState } from "react";
import { Title, Box } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { StorageManager } from "../../../../helpers/storageManager";

const Countdown = () => {
    const history = useHistory();
    const { gamePin, round } = useParams();

    const letter = StorageManager.getLetter();
    const [countdownDone, setCountdownDone] = useState(false);

    const countdownComplete = () => {
        setCountdownDone(true);
        setTimeout(() => {
            history.replace(`/game/${gamePin}/round/${StorageManager.getRound()}/board/`);
        }, 1200);
    };

    const contentCountdown = (
        <Box align="center">
            <Title
                color="white"
                sx={{ marginTop: "25%" }}
            >
                {" "}
                round {round}
            </Title>
            <Title
                color="white"
                size="100"
                sx={{ marginTop: "20%" }}
            >
                <CountdownCircleTimer
                    isPlaying
                    duration={3}
                    colors={["#004777"]}
                    onComplete={countdownComplete}
                    align="center"
                >
                    {({ remainingTime }) => remainingTime}
                </CountdownCircleTimer>
            </Title>
        </Box>
    );

    const contentNextLetter = (
        <Box align="center">
            <Title
                color="white"
                sx={{ marginTop: "25%" }}
            >
                {" "}
                next letter:
            </Title>
            <Title
                color="white"
                size="150"
                sx={{ marginTop: "10%" }}
            >
                {letter}
            </Title>
        </Box>
    );

    return <BaseContainer> {!countdownDone ? contentCountdown : contentNextLetter} </BaseContainer>;
};

export default Countdown;
