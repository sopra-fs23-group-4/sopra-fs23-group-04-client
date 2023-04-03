import { Avatar, Button, Container, Stack, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StandardButton from "../ui/StandardButton";

const Dashboard = () => {
    useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/users/${sessionStorage.getItem("user_id")}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUser(response.data);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }
        fetchData();
    }, [user]);

    //TO-DO: Logout

    return (
        <BaseContainer>
            <Container size="sm">
                <Stack align="center">
                    <Title
                        align="center"
                        order={1}
                        sx={{ color: "white" }}
                    >
                        userName
                        <Text
                            align="center"
                            sx={{ color: "white", fontSize: "small" }}
                        ></Text>
                    </Title>
                    <Avatar
                        src="../../resources/emptyProfile.png"
                        alt="it's me"
                        size="xl"
                    />
                    <Button
                        color="green"
                        radius="xl"
                        size="lg"
                        sx={{ width: "160px", color: "black" }}
                    >
                        PLAY
                    </Button>
                    <Container sx={{ color: "white", border: "2px solid white", height: "100px", width: "160px" }}>Leaderboard: see more...</Container>
                    <StandardButton>Logout</StandardButton>
                </Stack>
            </Container>
        </BaseContainer>
    );
};
export default Dashboard;
