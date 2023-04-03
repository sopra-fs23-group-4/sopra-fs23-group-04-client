import { Avatar, Button, Container, List, Paper, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StandardButton from "../ui/StandardButton";
import { Edit as EditIcon } from "tabler-icons-react";

const Dashboard = () => {
    const history = useHistory();
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

    const logout = async () => {
        await api.put(`/logout/${localStorage.getItem("id")}`);
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        history.push("/login");
    };

    return (
        <BaseContainer>
            <Title
                align="center"
                order={1}
                sx={{ color: "white" }}
                onClick={() => history.push("/profile/edit/quote")}
            >
                wigeto{" "}
                <EditIcon
                    color="#f8af05"
                    size={22}
                />
                <Text
                    align="center"
                    sx={{ color: "white", fontSize: "small" }}
                ></Text>{" "}
            </Title>
            <Avatar
                src="../../resources/emptyProfile.png"
                alt="it's me"
                size="xl"
                onClick={() => history.push("/profile/edit/picture")}
            />
            <Text
                align="center"
                size="md"
                color="white"
                fw={500}
                sx={{ width: "80%", marginBottom: "2%" }}
                onClick={() => history.push("/profile/edit/quote")}
            >
                "this is a very creative, generated quote, which shows everyone how cool I am!"{" "}
                <EditIcon
                    color="#f8af05"
                    size={18}
                />
            </Text>
            <Button
                variant="gradient"
                gradient={{ from: "teal", to: "lime", deg: 105 }}
                radius="xl"
                size="lg"
                sx={{ width: "180px", color: "black", marginBottom: "2%" }}
            >
                PLAY
            </Button>
            <Container
                align="center"
                sx={{
                    color: "white",

                    height: "140px",
                    width: "160px",
                    marginBottom: "0%",
                }}
            >
                <Paper>
                    <Text color="black">
                        <strong>ALL TIME BEST:</strong>
                    </Text>
                    <List
                        align="center"
                        type="ordered"
                        size="sm"
                    >
                        <List.Item>LexuTros</List.Item>
                        <List.Item>wigeto</List.Item>
                        <List.Item>Queenslayer</List.Item>
                    </List>
                    <Link>see more...</Link>
                </Paper>
            </Container>
            {/*<Container sx={{ color: "white", border: "2px solid white", height: "100px", width: "160px" }}>Leaderboard: see more...</Container>*/}
            <StandardButton onClick={() => logout()}>Logout </StandardButton>
        </BaseContainer>
    );
};
export default Dashboard;
