import React, { useEffect, useState } from "react";
import { Table, Text, Center } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { StorageManager } from "../../helpers/storageManager";
import { handleError, RestApi } from "../../api/RestApi";
import StandardButton from "../ui/StandardButton";
import { useHistory } from "react-router-dom";
import TopTitle from "../ui/TopTitle";
import PaperBox from "../ui/PaperBox";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [userPosition, setUserPosition] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const fetchLeaderboard = () => {
            if (leaderboard.length === 0) {
                RestApi.getLeaderboard()
                    .then((data) => {
                        setLeaderboard(data);
                        // Find the index of the logged-in user
                        const loggedInUser = StorageManager.getUsername();
                        const position = data.findIndex((entry) => entry.username === loggedInUser);
                        setUserPosition(position);
                    })
                    .catch((error) => {
                        console.error(`Something went wrong fetching the leaderboard: \n${handleError(error)}`);
                    });
            }
        };

        fetchLeaderboard();
    }, [leaderboard]);

    let tableBodyContent = (
        <tbody>
            <tr key="No Players">
                <td></td>
                <td>No players found.</td>
                <td></td>
            </tr>
        </tbody>
    );

    if (leaderboard.length > 0) {
        // Assign ranks to the users
        let rank = 1;
        let previousScore = null;
        const usersWithRanks = leaderboard.map((user, index) => {
            if (user.accumulatedScore !== previousScore) {
                rank = index + 1;
                user.rank = rank;
            } else {
                user.rank = rank;
            }
            previousScore = user.accumulatedScore;
            return user;
        });

        tableBodyContent = (
            <tbody>
                {usersWithRanks.slice(0, 5).map((user) => (
                    <tr key={user.username}>
                        <td>
                            <Center>{user.rank}.</Center>
                        </td>
                        <td>
                            <Text
                                onClick={() => history.push(`/profile/${user.username}`)}
                                sx={{ cursor: "pointer" }}
                            >
                                {" "}
                                {user.username}
                            </Text>
                        </td>
                        <td>
                            <Center>{user.accumulatedScore}</Center>
                        </td>
                    </tr>
                ))}
                {userPosition !== null && userPosition >= 5 && (
                    <>
                        <tr key={"..."}>
                            <td></td>
                            <td>...</td>
                            <td></td>
                        </tr>
                        <tr key={usersWithRanks[userPosition].username}>
                            <td>{usersWithRanks[userPosition].rank}.</td>
                            <td>{usersWithRanks[userPosition].username}</td>
                            <td>{usersWithRanks[userPosition].accumulatedScore}</td>
                        </tr>
                    </>
                )}
            </tbody>
        );
    }

    return (
        <BaseContainer>
            <TopTitle>leaderboard</TopTitle>
            <PaperBox p="xs">
                <Table
                    sx={{ color: "white" }}
                    fontSize="lg"
                >
                    <thead>
                        <tr>
                            <th style={{ color: "white" }}>rank</th>
                            <th style={{ color: "white" }}>name</th>
                            <th style={{ color: "white" }}>score</th>
                        </tr>
                    </thead>
                    {tableBodyContent}
                </Table>
            </PaperBox>
            <StandardButton
                onClick={() => history.push("/dashboard")}
                sx={{ marginTop: "10%" }}
            >
                home{" "}
            </StandardButton>
        </BaseContainer>
    );
};

export default Leaderboard;
