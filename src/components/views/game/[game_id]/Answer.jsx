import BaseContainer from "../../../ui/BaseContainer";
import { useHistory, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Text, Group, TextInput, Title } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import * as gameFunctions from "../../../../helpers/gameFunction";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";

const Answer = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const history = useHistory();
    const { gamePin, round, answerIndex } = useParams();

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const [answers, setAnswers] = useState(StorageManager.getAnswers());

    const category = categories[answerIndex];
    const lastElement = categories.length - 1;

    const [timer, setTimer] = useState(null);

    const handleAnswerChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex] = event.currentTarget.value;
        setAnswers(newAnswers);
        saveAnswers();
    };

    const saveAnswers = () => {
        StorageManager.setAnswers(answers);
    };

    const handlePrevious = () => {
        saveAnswers();
        if (parseInt(answerIndex) !== 0) {
            history.push(`/game/${gamePin}/round/${round}/board/${answerIndex - 1}`);
        } else {
            history.push(`/game/${gamePin}/round/${round}/board/${lastElement}`);
        }
    };

    const handleNext = () => {
        saveAnswers();
        if (parseInt(answerIndex) !== lastElement) {
            history.push(`/game/${gamePin}/round/${round}/board/${parseInt(answerIndex) + 1}`);
        } else {
            history.push(`/game/${gamePin}/round/${round}/board/0`);
        }
    };

    const handleOverview = () => {
        saveAnswers();
        history.push(`/game/${gamePin}/round/${round}/board/`);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleNext();
        }
    };
    const postAnswers = async (answersDict) => {
        try {
            await RestApi.postAnswers(gamePin, round, answersDict);
            history.push(`/game/${gamePin}/round/${round}/voting/0`);
        } catch (error) {
            alert(`Something went wrong while sending the answers: \n${handleError(error)}`);
        }
    };

    const doDoneButton = async () => {
        await RestApi.EndRound(gamePin, round);
    };

    const doDoneWs = async () => {
        saveAnswers();
        const answersDict = gameFunctions.createAnswerDictionary(categories, answers);
        await postAnswers(answersDict);
    };

    let onConnected = () => {
        console.log("Connected!!");
    };
    let onDisconnected = () => {
        console.log("disconnect");
    };
    let onMessageReceived = async (msg) => {
        console.log(msg.type);
        if (msg.type === "roundEnd") {
            setTimer(0);
            await doDoneWs();
        } else if (msg.type === "roundTimer") {
            setTimer(msg.timeRemaining);
        }
    };

    return (
        <BaseContainer>
            <SockJsClient
                url={SOCKET_URL}
                topics={[`/topic/lobbies/${gamePin}`]}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={(msg) => onMessageReceived(msg)}
                debug={false}
            />
            <Text color="white">Time remaining: {timer}</Text>
            <Title
                color="white"
                size="80"
            >
                {letter}
            </Title>
            <Title color="white">{category}</Title>
            <TextInput
                value={answers[answerIndex] ? answers[answerIndex] : letter}
                radius="xl"
                size="lg"
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                sx={{ "& .mantine-TextInput-label": { color: "white" } }}
            />
            <Group sx={{ marginTop: "2%" }}>
                <StandardButton
                    sx={{ width: "100px" }}
                    onClick={() => handlePrevious()}
                >
                    previous
                </StandardButton>
                <StandardButton
                    sx={{ width: "100px" }}
                    onClick={() => handleNext()}
                >
                    next
                </StandardButton>
            </Group>
            <StandardButton
                sx={{ marginTop: "5%" }}
                onClick={() => handleOverview()}
            >
                overview
            </StandardButton>
            <StandardButton
                sx={{ marginTop: "5%" }}
                disabled={!answers.every((value) => value !== null && value !== "" && value !== { letter })}
                onClick={() => doDoneButton()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Answer;
