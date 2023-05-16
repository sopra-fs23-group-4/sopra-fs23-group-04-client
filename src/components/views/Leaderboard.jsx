import React, { useEffect, useState } from "react";
import { Paper, Table, Title } from "@mantine/core";
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
            <Paper
                radius="md"
                shadow="xl"
                p="lg"
                bg="rgba(0, 255, 0, .1)"
                sx={{ background: "inherit", minWidth: "220px", border: "4px solid white" }}
            >
                <Table
                    sx={{ color: "white" }}
                    fontSize="lg"
                >
                    <thead>
                        <tr>
                            <th style={{ color: "white" }}>Rank</th>
                            <th style={{ color: "white" }}>Name</th>
                            <th style={{ color: "white" }}>Score</th>
                        </tr>
                    </thead>
                    {leaderboard.length > 0 ? (
                        <tbody>
                            {leaderboard.slice(0, 10).map((entry, index) => (
                                <tr key={entry.username}>
                                    <td>{index + 1}.</td>
                                    <td>{entry.username}</td>
                                    <td>{entry.accumulatedScore}</td>
                                </tr>
                            ))}
                            {userPosition !== null && userPosition >= 10 && (
                                <>
                                    <tr key={"..."}>...</tr>
                                    <tr key={leaderboard[userPosition].username}>
                                        <td>{userPosition + 1}.</td>
                                        <td>{leaderboard[userPosition].username}</td>
                                        <td>{leaderboard[userPosition].accumulatedScore}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>No players found.</tr>
                        </tbody>
                    )}
                </Table>
            </Paper>
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
