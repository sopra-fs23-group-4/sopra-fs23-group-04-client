import { Avatar, Button, Container, Loader, MantineProvider, Stack, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { api, handleError } from "../../helpers/api";
import StandardButton from "../ui/StandardButton";
import { Edit as EditIcon } from "tabler-icons-react";

const Dashboard = () => {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const responseUserId = await api.get(`/users/${sessionStorage.getItem("user_id")}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUser(responseUserId.data);
                console.log(responseUserId);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
            try {
                const responseUsers = await api.get(`/users/`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setUsers(responseUsers.data);
                console.log(responseUsers);
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

    let contentUserName = <Loader />;
    let contentQuote = "no Quote";
    let contentPicture = "";
    if (user) {
        contentUserName = user.username;
        contentQuote = user.quote;
        contentPicture = user.picture;
    }

    let contentUsers = <Loader />;
    if (users) {
        contentUsers = "here come the users";
    }

    return (
        <BaseContainer>
            <Stack
                align="center"
                spacing="xs"
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                    onClick={() => history.push("/profile/edit/quote")}
                >
                    {contentUserName}{" "}
                    <EditIcon
                        color="#f8af05"
                        size={22}
                    />
                </Title>
                <Avatar
                    src={contentPicture}
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
                    {contentQuote}{" "}
                    <EditIcon
                        color="#f8af05"
                        size={18}
                    />
                </Text>
            </Stack>
            <Button
                onClick={() => history.push("/game/")}
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
                sx={{ color: "white", border: "1px solid white", height: "100px", width: "180px" }}
            >
                <strong>ALL-TIME BEST:</strong>
                <div> {contentUsers} </div>
                <MantineProvider
                    theme={{
                        colorScheme: "dark",
                    }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <Link onClick={() => history.push("/users/")}>see more... </Link>
                </MantineProvider>
            </Container>
            <StandardButton
                onClick={() => logout()}
                sx={{ marginTop: "0px" }}
            >
                Logout{" "}
            </StandardButton>
        </BaseContainer>
    );
};
export default Dashboard;
