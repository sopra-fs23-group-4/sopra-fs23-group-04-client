import BaseContainer from "../../../ui/BaseContainer";
import { useHistory, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Group, TextInput, Title } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { storageManager } from "../../../../helpers/storageManager";

const Answer = () => {
    const history = useHistory();
    const { gameId, round, answerIndex } = useParams();

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

    const createAnswerDictionary = (categories, answers) => {
        const answerDict = {};
        for (let i = 0; i < categories.length; i++) {
            const key = categories[i];
            answerDict[key] = answers[i];
        }
        return answerDict;
    };

    const doDone = () => {
        saveAnswers();
        console.log(createAnswerDictionary(categories, answers));
    };
    const handlePrevious = () => {
        saveAnswers();
        if (parseInt(answerIndex) !== 0) {
            history.push(`/game/${gameId}/round/${round}/board/${answerIndex - 1}`);
        } else {
            history.push(`/game/${gameId}/round/${round}/board/${lastElement}`);
        }
    };

    const handleNext = () => {
        saveAnswers();
        if (parseInt(answerIndex) !== lastElement) {
            history.push(`/game/${gameId}/round/${round}/board/${parseInt(answerIndex) + 1}`);
        } else {
            history.push(`/game/${gameId}/round/${round}/board/0`);
        }
    };

    const handleOverview = () => {
        saveAnswers();
        history.push(`/game/${gameId}/round/${round}/board/`);
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
