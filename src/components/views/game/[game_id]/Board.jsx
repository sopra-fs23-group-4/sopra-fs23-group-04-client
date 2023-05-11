import { useHistory, useParams } from "react-router-dom";
import { Checkbox as CheckIcon, Edit as EditIcon } from "tabler-icons-react";
import React, { useState } from "react";
import BaseContainer from "../../../ui/BaseContainer";
import StandardButton from "../../../ui/StandardButton";
import { Button, Stack, Title, Text } from "@mantine/core";
import { StorageManager } from "../../../../helpers/storageManager";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import * as gameFunctions from "../../../../helpers/gameFunction";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";

const Board = () => {
    const SOCKET_URL = getDomain() + "/ws-message";
    const history = useHistory();
    const { gamePin, round } = useParams();

    const letter = StorageManager.getLetter();
    const categories = StorageManager.getCategories();
    const answers = StorageManager.getAnswers();
    const [timer, setTimer] = useState(45);

    /*    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                if (isMounted) {
                    if (!letter) {
                        sessionStorage.setItem("letter", "A");
                        setLetter(sessionStorage.getItem("letter"));
                        console.log(sessionStorage);
                    }
                    if (!categories) {
                        storageManager.setCategories(["City", "Country", "FirstName", "Musical Instrument"]);
                        setCategories(storageManager.getCategories());
                    }

                    if (!answers) {
                        setAnswers(Array(4).fill(null));
                    }
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the categories! See the console for details.");
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);*/

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
        const answersDict = gameFunctions.createAnswerDictionary(categories, answers);
        await postAnswers(answersDict);
    };

    const doAnswer = (index) => {
        StorageManager.setLetter(letter);
        StorageManager.setAnswers(answers);
        StorageManager.setCategories(categories);
        history.push(`/game/${gamePin}/round/${round}/board/${index}`);
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
                    onClick={() => doAnswer(index)}
                >
                    {category}&nbsp; {iconContent}
                </Button>
            </div>
        );
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
            <StandardButton
                position="center"
                sx={{ marginTop: "5%" }}
                disabled={!answers.every((value) => value !== null && value !== "" && value !== { letter })}
                onClick={() => doDoneButton()}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Board;
