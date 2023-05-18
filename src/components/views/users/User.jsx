import BaseContainer from "../../ui/BaseContainer";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { Paper, Table, Text, Title } from "@mantine/core";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";

export const StatEntry = (props) => {
    return (
        <tr>
            <td>{props.statName}</td>
            <td>
                <Text
                    inline
                    align="right"
                >
                    {props.statValue}
                </Text>{" "}
            </td>
        </tr>
    );
};

const User = (props) => {
    const username = props.match.params["username"];
    const history = useHistory();

    const [user, setUser] = useState({ username: "" });
    const [stats, setStats] = useState({ rank: "" });

    useEffect(() => {
        async function fetchData() {
            try {
                if (user.username === "") {
                    // real code
                    let userResponse = await RestApi.getUserByUsername(username);
                    setUser(userResponse);

                    let statResponse = await RestApi.getAdvancedStatistics(userResponse.id);
                    console.log(statResponse);
                    setStats(statResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the user and its stats: \n${handleError(error)}`);
            }
        }
        fetchData();
    }, [user, stats, username]);

    return (
        <BaseContainer>
            <Title
                align="center"
                order={1}
                sx={{ color: "white", marginTop: "2%" }}
            >
                {user.username}
            </Title>

            <Text
                align="center"
                size="md"
                color="white"
                fw={500}
                sx={{ width: "80%", marginBottom: "4%" }}
            >
                "{user.quote}"
            </Text>
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
                            <th>
                                <Title
                                    order={3}
                                    inline
                                    sx={{ color: "white" }}
                                >
                                    Stats:
                                </Title>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <StatEntry
                            statName={"Rank"}
                            statValue={stats.rank}
                        />
                        <StatEntry
                            statName={"Points Overall"}
                            statValue={stats.totalPointsOverall}
                        />
                        <StatEntry
                            statName={"Games Played"}
                            statValue={stats.totalPlayedGames}
                        />
                        <StatEntry
                            statName={"Games Won"}
                            statValue={stats.totalWins}
                        />
                        <StatEntry
                            statName={"Answers Given"}
                            statValue={stats.totalAnswersAnswered}
                        />
                        <StatEntry
                            statName={"Unique Answers"}
                            statValue={stats.totalCorrectAndUniqueAnswers}
                        />
                        <StatEntry
                            statName={"Most Played Category"}
                            statValue={stats.mostPlayedCategory ? stats.mostPlayedCategory : "-"}
                        />
                    </tbody>
                </Table>
            </Paper>
            <StandardButton
                onClick={history.goBack}
                sx={{ marginTop: "3%", marginBottom: "5%" }}
            >
                Back
            </StandardButton>
        </BaseContainer>
    );
};

export default User;
