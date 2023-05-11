import React, { useEffect, useState } from "react";
import { Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { StorageManager } from "../../helpers/storageManager";
import { RestApi } from "../../helpers/RestApi";
import StandardButton from "../ui/StandardButton";
import { useHistory } from "react-router-dom";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const history = useHistory();

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const data = await RestApi.getLeaderboard();
            setLeaderboard(data);

            // Find the index of the logged-in user
            const loggedInUser = StorageManager.getUsername();
            const position = data.findIndex((entry) => entry.username === loggedInUser);
            setUserPosition(position);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    return (
        <BaseContainer>
            <Title
                align="center"
                order={1}
                sx={{ color: "white" }}
            >
                Leaderboard
            </Title>
            {leaderboard.length > 0 ? (
                <>
                    {leaderboard.slice(0, 10).map((entry, index) => (
                        <Text
                            key={entry.username}
                            align="center"
                            size="md"
                            color="white"
                            fw={500}
                        >
                            {index + 1}. {entry.username} - {entry.accumulatedScore} points
                        </Text>
                    ))}
                    {userPosition !== null && userPosition >= 10 && (
                        <>
                            <Text
                                align="center"
                                size="md"
                                color="white"
                                fw={500}
                            >
                                ...
                            </Text>
                            <Text
                                align="center"
                                size="md"
                                color="white"
                                fw={500}
                            >
                                {userPosition + 1}. {leaderboard[userPosition].username} - {leaderboard[userPosition].accumulatedScore} points
                            </Text>
                        </>
                    )}
                </>
            ) : (
                <Text
                    align="center"
                    size="md"
                    color="white"
                    fw={500}
                >
                    No players found.
                </Text>
            )}
            <StandardButton
                onClick={() => history.push("/dashboard")}
                sx={{ marginTop: "10%" }}
            >
                Back{" "}
            </StandardButton>
        </BaseContainer>
    );
};

export default Leaderboard;
