import BaseContainer from "../../../ui/BaseContainer";
import { Title, Flex, Stack, Paper } from "@mantine/core";
import StandardButton from "../../../ui/StandardButton";
import { storageManager } from "../../../../helpers/storageManager";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../../helpers/RestApi";

const Player = (props) => (
    <Title
        color="white"
        order={3}
        {...props}
    >
        {props.user}
    </Title>
);

const Lobby = (props) => {
    const gamePin = props.match.params["gamePin"];
    const history = useHistory();

    const [users, setUsers] = useState([]);
    const user = storageManager.getUsername();

    useEffect(() => {
      async function fetchData() {
        try {
          const responseUsers = await RestApi.getUsers();
          setUsers(responseUsers);

        } catch (error) {
          console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
          console.error("Details:", error);
          alert("Something went wrong while fetching the users! See the console for details.");
        }
      }
      fetchData();
    }, []);


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
                        user={user}
                        onClickBehaviour={() => console.log("click")}
                    />
                </Flex>
                <Stack
                    justify="flex-start"
                    align="center"
                    spacing="sm"
                >
                    {users.map((user) => (
                      <Player onClick={() => history.push(`/users/${user.id}`)}>{user.name}</Player>
                    ))}
                </Stack>
            </Paper>
            <StandardButton>Leave</StandardButton>
        </BaseContainer>
    );
};

export default Lobby;
