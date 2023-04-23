import BaseContainer from "../../../ui/BaseContainer";
import { useHistory, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Group, TextInput, Title } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";

const Answer = () => {
    const history = useHistory();
    const { gameId, answerIndex } = useParams();

    const [letter, setLetter] = useState("A");
    const [categories, setCategories] = useState(["City", "Country", "FirstName", "Musical Instrument"]);
    const [answers, setAnswers] = useState(["Appenzell", "Andorra", null, "Audi"]);
    const category = categories[answerIndex];
    const lastElement = answers.length - 1;

    const handleAnswerChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[answerIndex] = event.currentTarget.value;
        setAnswers(newAnswers);
    };

    const handlePrevious = () => {
        if (parseInt(answerIndex) !== 0) {
            history.push(`/game/${gameId}/board/${answerIndex - 1}`);
        } else {
            history.push(`/game/${gameId}/board/${lastElement}`);
        }
    };

    const handleNext = () => {
        if (parseInt(answerIndex) !== lastElement) {
            history.push(`/game/${gameId}/board/${parseInt(answerIndex) + 1}`);
        } else {
            history.push(`/game/${gameId}/board/0`);
        }
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
                onClick={() => history.push(`/game/${gameId}/board/`)}
            >
                overview
            </StandardButton>
            <StandardButton
                sx={{ marginTop: "5%" }}
                disabled={!answers.every((value) => value !== null)}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Answer;
