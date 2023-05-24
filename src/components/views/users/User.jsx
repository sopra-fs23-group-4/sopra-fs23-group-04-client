import BaseContainer from "../../ui/BaseContainer";
import React, { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../api/RestApi";
import { Flex, Table, Text, Title } from "@mantine/core";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import TopTitle from "../../ui/TopTitle";
import PaperBox from "../../ui/PaperBox";

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
        const fetchData = () => {
            if (user.username === "") {
                RestApi.getUserByUsername(username)
                    .then((userResponse) => {
                        setUser(userResponse);
                        return RestApi.getAdvancedStatistics(userResponse.id);
                    })
                    .then((statResponse) => {
                        console.log(statResponse);
                        setStats(statResponse);
                    })
                    .catch((error) => {
                        console.error(`Something went wrong while fetching the user and its stats: \n${handleError(error)}`);
                    });
            }
        };

        fetchData();
    }, [user, stats, username]);

    return (
        <BaseContainer>
            <TopTitle>user page</TopTitle>
            <Title
                align="center"
                order={1}
                sx={{ color: "white" }}
            >
                {user.username}
            </Title>

            <Text
                align="center"
                size="md"
                color="white"
                fw={500}
                sx={{ width: "80%", marginTop: "-1%" }}
            >
                "{user.quote}"
            </Text>
            <PaperBox p="xs">
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
                                    stats:
                                </Title>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <StatEntry
                            statName={"rank"}
                            statValue={stats.rank}
                        />
                        <StatEntry
                            statName={"points overall"}
                            statValue={stats.totalPointsOverall}
                        />
                        <StatEntry
                            statName={"games played"}
                            statValue={stats.totalPlayedGames}
                        />
                        <StatEntry
                            statName={"games won"}
                            statValue={stats.totalWins}
                        />
                        <StatEntry
                            statName={"answers given"}
                            statValue={stats.totalAnswersAnswered}
                        />
                        <StatEntry
                            statName={"unique answers"}
                            statValue={stats.totalCorrectAndUniqueAnswers}
                        />
                        <StatEntry
                            statName={"most played category"}
                            statValue={stats.mostPlayedCategory ? stats.mostPlayedCategory : "-"}
                        />
                    </tbody>
                </Table>
            </PaperBox>
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="row"
                sx={{ marginTop: "3%", marginBottom: "5%" }}
            >
                <StandardButton onClick={() => history.replace(`/dashboard`)}>home</StandardButton>
                <StandardButton onClick={() => history.replace("/leaderboard")}>leaderboard</StandardButton>
            </Flex>
        </BaseContainer>
    );
};

export default User;
