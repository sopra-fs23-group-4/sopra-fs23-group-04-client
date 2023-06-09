import { Button, Menu, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import StandardButton from "../ui/StandardButton";
import { OneTwoThree, QuestionMark } from "tabler-icons-react";
import { IconMenu2, IconMessageCircle, IconUser } from "@tabler/icons-react";
import { StorageManager } from "../../helpers/storageManager";
import TopTitle from "../ui/TopTitle";
import PaperBox from "../ui/PaperBox";

const Dashboard = () => {
    const history = useHistory();

    const username = StorageManager.getUsername();
    const quote = StorageManager.getQuote();

    useEffect(() => {
        StorageManager.resetGame();
    }, [quote]);

    const doLogout = async () => {
        StorageManager.clearAll();
        history.push("/login");
    };

    const contentMenu = (
        <Menu
            position="bottom"
            shadow="md"
            width={200}
            sx={{ opacity: 0.9, marginTop: "2%", marginBottom: "2%" }}
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
                        menu{" "}
                    </Text>
                </Button>
            </Menu.Target>

            <Menu.Dropdown position="bottom">
                <Menu.Label>Personal</Menu.Label>
                <Menu.Item
                    icon={<IconUser size={18} />}
                    onClick={() => history.push(`/profile/${username}`)}
                >
                    profile page
                </Menu.Item>
                <Menu.Item
                    icon={<IconMessageCircle size={16} />}
                    onClick={() => history.push("/profile/edit/quote")}
                >
                    change quote
                </Menu.Item>
                <Menu.Label>Game</Menu.Label>
                <Menu.Item
                    icon={<OneTwoThree size={18} />}
                    onClick={() => history.push("/leaderboard")}
                >
                    leaderboard
                </Menu.Item>
                <Menu.Item
                    icon={<QuestionMark size={18} />}
                    onClick={() => history.push("/rules")}
                >
                    rules
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    return (
        <BaseContainer>
            <TopTitle>welcome</TopTitle>
            <PaperBox
                px="xl"
                style={{ marginTop: "2%" }}
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white", marginTop: "2%", cursor: "pointer" }}
                    onClick={() => history.push(`/profile/${username}`)}
                >
                    {username}{" "}
                </Title>

                <Text
                    align="center"
                    size="md"
                    color="white"
                    fw={500}
                    sx={{ marginTop: "2%", marginBottom: "5%", cursor: "pointer" }}
                    onClick={() => history.push("/profile/edit/quote")}
                >
                    {quote}{" "}
                </Text>
            </PaperBox>

            <StandardButton
                onClick={() => history.push("/game/")}
                size="lg"
                sx={{ width: "140px", marginTop: "5%", marginBottom: "2%" }}
            >
                play
            </StandardButton>

            {contentMenu}

            <StandardButton
                onClick={() => doLogout()}
                sx={{ marginTop: "10%" }}
            >
                logout{" "}
            </StandardButton>
        </BaseContainer>
    );
};
export default Dashboard;
