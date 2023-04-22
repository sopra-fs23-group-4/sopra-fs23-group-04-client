import { Avatar, Button, Loader, Stack, Text, Title } from "@mantine/core";
import { Dialog, Group, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import StandardButton from "../ui/StandardButton";
import { Edit as EditIcon } from "tabler-icons-react";
import User from "../../models/User";
import { RestApi, handleError } from "../../helpers/RestApi";

const Dashboard = () => {
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUserId = await RestApi.getUser();
                setUser(new User(responseUserId.data));
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }
        fetchData();
    }, []);

    const doLogout = async () => {
        sessionStorage.clear();
        history.push("/login");
    };

    const [opened, { toggle, close }] = useDisclosure(false);

    let contentUserName = <Loader />;
    let contentQuote = "";
    let contentPicture = "";
    if (user) {
        contentUserName = user.username;
        contentQuote = (
            <Text
                align="center"
                size="md"
                color="white"
                fw={500}
                sx={{ width: "80%", marginBottom: "2%" }}
                onClick={() => history.push("/profile/edit/quote")}
            >
                {user.quote}{" "}
                <EditIcon
                    color="#f8af05"
                    size={18}
                />
            </Text>
        );
        contentPicture = user.picture;
    }

    return (
        <BaseContainer>
            <Stack
                style={{ width: "80%" }}
                align="center"
                spacing="xs"
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                    onClick={toggle}
                >
                    {contentUserName}{" "}
                    {/*                    <EditIcon
                        color="#f8af05"
                        size={22}
                    />*/}
                </Title>

                <Dialog
                    opened={opened}
                    withCloseButton
                    transition="slide-up"
                    transitionDuration={300}
                    transitionTimingFunction="ease"
                    onClose={close}
                    size="lg"
                    radius="md"
                    sx={{ width: "260px", color: "black", marginBottom: "2%" }}
                >
                    <Text
                        size="sm"
                        mb="sm"
                        weight={500}
                    >
                        Change username:
                    </Text>

                    <Group align="flex-end">
                        <TextInput
                            placeholder="enter new username"
                            sx={{ flex: 1 }}
                        />
                        <StandardButton
                            size="sm"
                            onClick={close}
                        >
                            save
                        </StandardButton>
                    </Group>
                </Dialog>

                <Avatar
                    src={contentPicture}
                    alt="click to change"
                    size="xl"
                    onClick={() => history.push("/profile/edit/picture")}
                />
                {contentQuote}
            </Stack>
            <Button
                onClick={() => history.push("/game/")}
                variant="gradient"
                gradient={{ from: "#f8af05", to: "#f8af05", deg: 105 }}
                radius="xl"
                size="lg"
                sx={{ width: "140px", color: "black", marginBottom: "2%" }}
            >
                PLAY
            </Button>
            <StandardButton
                onClick={() => doLogout()}
                sx={{ marginTop: "5%" }}
            >
                Logout{" "}
            </StandardButton>
        </BaseContainer>
    );
};
export default Dashboard;
