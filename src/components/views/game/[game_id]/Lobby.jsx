import BaseContainer from "../../../ui/BaseContainer";
import { Title, Flex, Stack, Paper } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import { Context } from "../../../../context";
import { useContext, useState } from "react";

const Player = (props) => (
    <Title
        color="white"
        order={3}
        onClick={props.onClickBehaviour}
    >
        {props.user}
    </Title>
);

const Lobby = (props) => {
    const gamePin = props.match.params["gamePin"];
    const context = useContext(Context);
    const user = context.user;

    const [users, setUsers] = useState();

    return (
        <BaseContainer>
            <Flex
                mih={50}
                gap="md"
                justify="center"
                wrap="wrap"
            >
                <Title color="white">PIN:</Title>
                <Title color="white">{gamePin}</Title>
            </Flex>
            <Paper
                shadow="xl"
                radius="md"
                p="lg"
                sx={{ background: "#00acee", minWidth: "70%" }}
            >
                <Flex
                    mih={50}
                    gap="md"
                    justify="center"
                    wrap="wrap"
                >
                    <Title
                        order={3}
                        color="white"
                    >
                        Host:
                    </Title>
                    <Player
                        user={user.username}
                        onClickBehaviour={() => console.log("click")}
                    />
                </Flex>
                <Stack
                    justify="flex-start"
                    align="center"
                    spacing="sm"
                >
                    <Title
                        order={4}
                        color="white"
                    >
                        User
                    </Title>
                    <Title
                        order={4}
                        color="white"
                    >
                        User
                    </Title>
                    <Title
                        order={4}
                        color="white"
                    >
                        User
                    </Title>
                </Stack>
            </Paper>
            <StandardButton>Leave</StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
