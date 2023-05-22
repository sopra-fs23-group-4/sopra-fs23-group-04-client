import BaseContainer from "../../../ui/BaseContainer";
import { Flex, Loader, Space, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { StorageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";
import { Crown } from "tabler-icons-react";
import ReactTypingEffect from "react-typing-effect";
import { JackInTheBox } from "react-awesome-reveal";

const Winner = (props) => {
    const gamePin = props.match.params["gamePin"];

    const history = useHistory();

    const [winners, setWinners] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            if (winners.length === 0) {
                RestApi.getWinners(gamePin)
                    .then((winnerResponse) => {
                        return new Promise((resolve) => setTimeout(() => resolve(winnerResponse), 5000));
                    })
                    .then((winnerResponse) => {
                        setWinners(winnerResponse);
                    })
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the winners: \n${handleError(error)}`);
                    });
            }
        };

        fetchData();
    }, [winners, gamePin]);

    // Methods
    async function doLeave() {
        try {
            history.replace(`/game`);
        } catch (error) {
            console.error(`Something went wrong leaving the game: \n${handleError(error)}`);
        }
    }

    // Components
    let winnerPageContent = (
        <Flex
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            sx={{ width: "80%" }}
        >
            <Space h="xl" />
            <Title
                align="center"
                order={1}
                sx={{ color: "white", marginTop: "40%" }}
            >
                and the glorious winner is{" "}
                <Loader
                    color="white"
                    size="lg"
                    variant="dots"
                />
            </Title>
        </Flex>
    );

    if (winners.length === 1) {
        winnerPageContent = (
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
                sx={{ width: "80%" }}
            >
                <Space h="sm" />
                <JackInTheBox
                    duration={1000}
                    triggerOnce
                >
                    <Crown
                        size={80}
                        color="#ffffff"
                    />
                </JackInTheBox>
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white", marginTop: "-22px" }}
                >
                    {winners[0].username}
                </Title>
                <Text
                    align="center"
                    size="lg"
                    color="white"
                    fw={500}
                    sx={{ width: "80%", marginBottom: "2%" }}
                >
                    <ReactTypingEffect
                        text={[`"${winners[0].quote}"`]}
                        speed={50}
                        eraseDelay={999999999}
                        typingDelay={400}
                    />
                </Text>
                <StandardButton onClick={() => history.replace(`/game/${gamePin}/round/${StorageManager.getRound()}/score`)}>Scoreboard</StandardButton>
                <StandardButton
                    sx={{ marginTop: "4%" }}
                    onClick={() => {
                        StorageManager.resetGame();
                        history.replace(`/game`);
                    }}
                >
                    leave
                </StandardButton>
            </Flex>
        );
    } else if (winners.length > 1) {
        winnerPageContent = (
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
                wrap="wrap"
                sx={{ width: "80%", marginTop: "3%" }}
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                >
                    it's a draw!
                </Title>
                <Title
                    align="center"
                    order={2}
                    sx={{ color: "white", marginTop: "-18px", marginBottom: "20px" }}
                >
                    congratulations to:
                </Title>
                {winners.map((winner) => (
                    <Title
                        align="center"
                        order={1}
                        sx={{ color: "white" }}
                        key={winner.username}
                    >
                        {winner.username}
                    </Title>
                ))}
                <StandardButton
                    onClick={() => history.replace(`/game/${gamePin}/round/${StorageManager.getRound()}/score`)}
                    sx={{ marginTop: "35px" }}
                >
                    scoreboard
                </StandardButton>
                <StandardButton
                    sx={{ marginTop: "10%" }}
                    onClick={() => doLeave()}
                >
                    leave
                </StandardButton>
            </Flex>
        );
    }

    return <BaseContainer>{winnerPageContent}</BaseContainer>;
};

export default Winner;
