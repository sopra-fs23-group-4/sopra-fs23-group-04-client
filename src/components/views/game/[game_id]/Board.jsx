import { useHistory, useParams } from "react-router-dom";
import { Checkbox as CheckIcon, Edit as EditIcon } from "tabler-icons-react";
import React, { useState } from "react";
import BaseContainer from "../../../ui/BaseContainer";
import StandardButton from "../../../ui/StandardButton";
import { Button, Stack, Title, Text, TextInput, Group } from "@mantine/core";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import * as gameFunctions from "../../../../helpers/gameFunction";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";

const Board = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const history = useHistory();
    const { gamePin, round } = useParams();
    const [timer, setTimer] = useState(null);

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const lastElement = categories.length - 1;

    const [answers, setAnswers] = useState(StorageManager.getAnswers());
    const [answerIndex, setAnswerIndex] = useState(0);

    const [statusView, setStatusView] = useState(false);

    const saveAnswers = () => {
        StorageManager.setAnswers(answers);
    };

    const handleGoToAnswer = (index) => {
        setAnswerIndex(index);
        setStatusView(true);
    };

    const handleAnswerChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex] = event.currentTarget.value;
        setAnswers(newAnswers);
        saveAnswers();
    };

    const handlePrevious = () => {
        saveAnswers();
        if (answerIndex !== 0) {
            setAnswerIndex(answerIndex - 1);
        } else {
            setAnswerIndex(lastElement);
        }
    };

    const handleNext = () => {
        saveAnswers();
        if (answerIndex !== lastElement) {
            setAnswerIndex(answerIndex + 1);
        } else {
            setAnswerIndex(0);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleNext();
        }
    };

    const handleOverview = () => {
        saveAnswers();
        setStatusView(false);
    };

    const handleDoneButton = async () => {
        await RestApi.EndRound(gamePin, round);
    };

    const doDoneWs = async () => {
        saveAnswers();
        const answersDict = gameFunctions.createAnswerDictionary(categories, answers);
        await postAnswers(answersDict);
    };

    const postAnswers = async (answersDict) => {
        try {
            await RestApi.postAnswers(gamePin, round, answersDict);
            history.replace(`/game/${gamePin}/round/${round}/voting/0`);
        } catch (error) {
            console.error(`Something went wrong while sending the answers: \n${handleError(error)}`);
        }
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

    const Category = ({ category }) => {
        let index = categories.indexOf(category);
        let iconContent = (
            <EditIcon
                strokeWidth={1.8}
                color="red"
                size={21}
            />
        );
        if (answers[index]) {
            iconContent = (
                <CheckIcon
                    color="green"
                    size={20}
                />
            );
        }

        return (
            <div
                className="player container"
                align="center"
            >
                <Button
                    variant="gradient"
                    gradient={{ from: "white", to: "white", deg: 105 }}
                    radius="xl"
                    size="lg"
                    sx={{ minWidth: "200px", color: "Black", marginBottom: "2%" }}
                    value={category}
                    onClick={() => handleGoToAnswer(index)}
                >
                    {category}&nbsp; {iconContent}
                </Button>
            </div>
        );
    };

    let contentOverview = (
        <Stack
            position="center"
            sx={{ marginTop: "2%" }}
        >
            {categories &&
                categories.map((category) => (
                    <Category
                        key={category}
                        category={category}
                    />
                ))}
        </Stack>
    );

    let contentAnswer = (
        <Stack align="center">
            <Title color="white">{categories[answerIndex]}</Title>
            <TextInput
                value={answers[answerIndex] ? answers[answerIndex] : letter}
                radius="xl"
                size="lg"
                onChange={handleAnswerChange}
                onKeyDown={handleKeyDown}
                sx={{ "& .mantine-TextInput-label": { color: "white" }, marginTop: "0%" }}
            />
            <Stack align="center">
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
            </Stack>
            <StandardButton
                align="center"
                sx={{ marginTop: "5%" }}
                onClick={() => handleOverview()}
            >
                overview
            </StandardButton>
        </Stack>
    );

    let contentView;
    if (statusView) {
        contentView = contentAnswer;
    } else {
        contentView = contentOverview;
    }

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
            <Text color="white">time remaining: {timer}</Text>
            <Title
                color="white"
                size="80"
            >
                {letter}
            </Title>
            {contentView}
            <StandardButton
                color="green"
                position="center"
                sx={{ marginTop: "5%", marginBottom: "5%" }}
                disabled={!answers.every((value) => value !== null && value !== "" && value !== { letter })}
                onClick={() => handleDoneButton()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Board;
