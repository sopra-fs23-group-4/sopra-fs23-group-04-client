import { Button, Menu, Stack, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import React from "react";
import StandardButton from "../ui/StandardButton";
import { Edit as EditIcon, OneTwoThree, QuestionMark } from "tabler-icons-react";
import { IconMenu2, IconMessageCircle } from "@tabler/icons-react";
import { StorageManager } from "../../helpers/storageManager";

const Dashboard = () => {
    const history = useHistory();

    const username = StorageManager.getUsername();
    const quote = StorageManager.getQuote();

    const doLogout = async () => {
        StorageManager.clearAll();
        history.push("/login");
    };

    /*    const [opened, { toggle, close }] = useDisclosure(false);*/

    return (
        <BaseContainer>
            <Stack
                sx={{ marginTop: "5%" }}
                style={{ width: "80%" }}
                align="center"
                spacing="xs"
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                    /*onClick={toggle}*/
                >
                    {username}{" "}
                    {/*                    <EditIcon
                        color="#f8af05"
                        size={22}
                    />*/}
                </Title>
                {/*
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
*/}
                <Text
                    align="center"
                    size="md"
                    color="white"
                    fw={500}
                    sx={{ width: "80%", marginBottom: "2%" }}
                    onClick={() => history.push("/profile/edit/quote")}
                >
                    {quote}{" "}
                    <EditIcon
                        color="#f8af05"
                        size={18}
                    />
                </Text>
            </Stack>

            <StandardButton
                onClick={() => history.push("/game/")}
                size="lg"
                sx={{ width: "140px", marginBottom: "2%" }}
            >
                PLAY
            </StandardButton>
            <Menu
                position="bottom"
                shadow="md"
                width={200}
                sx={{ opacity: 0.9, marginBottom: "2%" }}
            >
                <Menu.Target>
                    <Button
                        variant="default"
                        sx={{ marginBottom: "2%" }}
                    >
                        <IconMenu2
                            size={18}
                            strokeWidth={2}
                            color={"black"}
                        />
                        <Text
                            size="md"
                            sx={{ marginLeft: "5px" }}
                        >
                            {" "}
                            Menu{" "}
                        </Text>
                    </Button>
                </Menu.Target>

                <Menu.Dropdown position="bottom">
                    <Menu.Label>Personal</Menu.Label>
                    <Menu.Item
                        icon={<IconMessageCircle size={14} />}
                        onClick={() => history.push("/profile/edit/quote")}
                    >
                        Change Quote
                    </Menu.Item>
                    <Menu.Label>Game</Menu.Label>
                    <Menu.Item
                        icon={<OneTwoThree size={18} />}
                        onClick={() => history.push("/leaderboard")}
                    >
                        Scoreboard
                    </Menu.Item>
                    <Menu.Item
                        icon={<QuestionMark size={18} />}
                        onClick={() => history.push("/rules")}
                    >
                        Rules
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
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
