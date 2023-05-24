import { useHistory, useParams } from "react-router-dom";
import { Checkbox as CheckIcon, Edit as EditIcon } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import BaseContainer from "../../../ui/BaseContainer";
import StandardButton from "../../../ui/StandardButton";
import { Button, Stack, Title, Text, TextInput, Group, Box, Space } from "@mantine/core";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../api/RestApi";
import * as gameFunctions from "../../../../helpers/gameFunction";

const Category = ({ category, answers, handleGoToAnswer }) => {
    const categories = StorageManager.getCategories();
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

const Board = (props) => {
    const history = useHistory();
    const { gamePin, round } = useParams();
    const [timer, setTimer] = useState(null);

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const lastElement = categories.length - 1;

    const [answers, setAnswers] = useState(StorageManager.getAnswers());
    const [answerIndex, setAnswerIndex] = useState(0);

    const [errorLength, setErrorLength] = useState(null);
    const [statusView, setStatusView] = useState(false);

    // Websocket updates
    useEffect(() => {
        const handleWebsocketMsg = async (msg) => {
            if (msg.type === "roundEnd") {
                console.log(msg);
                setTimer(0);
                await doDoneWs();
            } else if (msg.type === "roundTimer") {
                setTimer(msg.timeRemaining);
            }
        };

        if (props.websocketMsg.type !== "null") {
            handleWebsocketMsg(props.websocketMsg)
                .then(() => {})
                .catch((error) => {
                    console.error(`Something went wrong processing the WebsocketMsg: \n${handleError(error)}`);
                });
        }
        // because this hook is only supposed to execute/rerender on a new Websocket call and use exclusively the state of the other variables at the given time,
        // it makes sense to disable the exhaustive dependency requirements:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.websocketMsg]);

    useEffect(() => {
        if (answers[answerIndex]?.length > 18) {
            setErrorLength("your answer is too long, it will be cut off");
        } else {
            setErrorLength(null);
        }
    }, [answers[answerIndex]]);

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
        try {
            await RestApi.EndRound(gamePin, round);
        } catch (error) {
            console.error(`Something went wrong while ending the round: \n${handleError(error)}`);
        }
    };

    let contentDone;
    if (answers.every((value) => value !== null && value !== "" && value !== { letter }))
        contentDone = (
            <StandardButton
                color="green"
                position="center"
                sx={{ width: "100px" }}
                onClick={() => handleDoneButton()}
            >
                done
            </StandardButton>
        );

    let contentOverview = (
        <Stack
            position="center"
            sx={{ marginTop: "2%" }}
        >
            {categories?.map((category) => (
                <Category
                    key={category}
                    category={category}
                    answers={answers}
                    handleGoToAnswer={handleGoToAnswer}
                />
            ))}
            <Space />
            <Box
                align="center"
                sx={{ marginTop: "10%" }}
            >
                {contentDone}
            </Box>
        </Stack>
    );

    let contentAnswer = (
        <Stack align="center">
            <Title color="white">{categories[answerIndex]}</Title>
            <TextInput
                error={errorLength}
                styles={{ error: { color: "white" } }}
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
            {contentDone}
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
            <Text color="white">time remaining: {timer}</Text>
            <Title
                color="white"
                size="80"
            >
                {letter}
            </Title>
            {contentView}
        </BaseContainer>
    );
};

export default Board;
