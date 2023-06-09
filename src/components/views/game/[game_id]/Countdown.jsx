import BaseContainer from "../../../ui/BaseContainer";
import React, { useCallback, useEffect, useState } from "react";
import { Title, Box } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { StorageManager } from "../../../../helpers/storageManager";
import { JackInTheBox, Zoom } from "react-awesome-reveal";

const Countdown = () => {
    const history = useHistory();
    const { gamePin, round } = useParams();

    const letter = StorageManager.getLetter();
    const [countdownDone, setCountdownDone] = useState(false);
    const [remainingTime, setRemainingTime] = useState(3);

    const countdownComplete = useCallback(() => {
        setCountdownDone(true);
        setTimeout(() => {
            history.replace(`/game/${gamePin}/round/${StorageManager.getRound()}/board/`);
        }, 1500);
    }, [history, gamePin]);

    useEffect(() => {
        if (remainingTime <= 0) {
            countdownComplete();
            return;
        }

        const intervalId = setInterval(() => {
            setRemainingTime((time) => time - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [remainingTime, countdownComplete]);

    const contentCountdown = (
        <Box align="center">
            <Title
                color="white"
                sx={{ marginTop: "50px" }}
            >
                {" "}
                round {round}
            </Title>
            <Title
                color="white"
                size="100"
                sx={{ marginTop: "20%" }}
            >
                <Zoom
                    key={remainingTime}
                    duration={1000}
                >
                    <div>{remainingTime}</div>
                </Zoom>
            </Title>
        </Box>
    );

    const contentNextLetter = (
        <Box align="center">
            <Title
                color="white"
                sx={{ marginTop: "50px" }}
            >
                {" "}
                next letter:
            </Title>
            <Title
                color="white"
                size="150"
                sx={{ marginTop: "10%" }}
            >
                <JackInTheBox
                    duration={1000}
                    triggerOnce
                >
                    <div>{letter}</div>
                </JackInTheBox>
            </Title>
        </Box>
    );

    return <BaseContainer> {!countdownDone ? contentCountdown : contentNextLetter} </BaseContainer>;
};

export default Countdown;
