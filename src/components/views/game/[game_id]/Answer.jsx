import BaseContainer from "../../../ui/BaseContainer";
import { useHistory, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Group, TextInput, Title } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { storageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import * as gameFunctions from "../../../../helpers/gameFunction";

const Answer = () => {
    const history = useHistory();
    const { gamePin, round, answerIndex } = useParams();

    const letter = storageManager.getLetter();
    const categories = storageManager.getCategories();
    const [answers, setAnswers] = useState(storageManager.getAnswers());

    const category = categories[answerIndex];
    const lastElement = categories.length - 1;

    const handleAnswerChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex] = event.currentTarget.value;
        setAnswers(newAnswers);
        saveAnswers();
    };

    const saveAnswers = () => {
        storageManager.setAnswers(answers);
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

    const postAnswers = async (answersDict) => {
        try {
            await RestApi.postAnswers(gamePin, round, answersDict);
            history.push(`/game/${gamePin}/round/${round}/scoreboard`);
        } catch (error) {
            alert(`Something went wrong while sending the answers: \n${handleError(error)}`);
        }
    };

    const doDone = () => {
        saveAnswers();
        const answersDict = gameFunctions.createAnswerDictionary(categories, answers);
        postAnswers(answersDict);
    };

    return (
        <BaseContainer>
            {" "}
            <Title
                sx={{ marginTop: "2%" }}
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
                disabled={!answers.every((value) => value !== null)}
                onClick={() => doDone()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Answer;
