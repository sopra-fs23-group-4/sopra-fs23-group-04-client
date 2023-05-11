import BaseContainer from "../../../ui/BaseContainer";
import { Flex, Loader, Space, Text, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { StorageManager } from "../../../../helpers/storageManager";
import StandardButton from "../../../ui/StandardButton";
import { Crown } from "tabler-icons-react";

const Winner = (props) => {
    const gamePin = props.match.params["gamePin"];

    const history = useHistory();

    const [winners, setWinners] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (winners.length === 0) {
                    // hardcoded sample values
                    const dummyWinners = [
                        {
                            username: "Günter",
                            score: 1500,
                            quote: "some soooo funny quote",
                        },
                        {
                            username: "Rüdiger",
                            score: 600,
                            quote:
                                "some even funnier quote, HAHA, this one also is very long because that might cause some issues " +
                                "if it is supposed to be displayed, potentially simultaneously with the first one...",
                        },
                    ];

                    // real code
                    let winnerResponse = await RestApi.getWinners(gamePin);

                    if (winnerResponse.length === 0) {
                        winnerResponse = winnerResponse.concat(dummyWinners);
                    }
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    setWinners(winnerResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the winners: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the winners! See the console for details.");
            }
        }
        fetchData();
    }, [winners, gamePin]);

    // Methods
    async function doLeave() {
        try {
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong leaving the game: \n${handleError(error)}`);
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
                And the glorious winner is{" "}
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
                <Crown
                    size={80}
                    color="#ffffff"
                />
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
                    "{winners[0].quote}"
                </Text>
                <StandardButton
                    component={Link}
                    to={`/game/${gamePin}/round/${StorageManager.getRound()}/score`}
                >
                    Scoreboard
                </StandardButton>
                <StandardButton
                    sx={{ marginTop: "4%" }}
                    onClick={() => doLeave()}
                >
                    Leave
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
                    It's a draw!
                </Title>
                <Title
                    align="center"
                    order={2}
                    sx={{ color: "white", marginTop: "-18px", marginBottom: "20px" }}
                >
                    Congratulations to:
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
                    component={Link}
                    to={`/game/${gamePin}/round/${StorageManager.getRound()}/score`}
                    sx={{ marginTop: "35px" }}
                >
                    Scoreboard
                </StandardButton>
                <StandardButton
                    sx={{ marginTop: "10%" }}
                    onClick={() => doLeave()}
                >
                    Leave
                </StandardButton>
            </Flex>
        );
    }

    return <BaseContainer>{winnerPageContent}</BaseContainer>;
};

export default Winner;
