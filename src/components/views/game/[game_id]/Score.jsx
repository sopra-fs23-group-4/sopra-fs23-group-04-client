import BaseContainer from "../../../ui/BaseContainer";
import { Title, Stack, Paper, Container, Group } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import { Player } from "./Lobby";
import { handleError } from "../../../../helpers/RestApi";

export const ScoreboardEntry = (props) => {

  return (
    <Group position="apart">
      <Player
      username={props.username}
      number={props.number} />
      <Title
        color="white"
        order={3}>
        {props.score}
      </Title>
    </Group>
      );
}

const Score = (props) => {
  const SOCKET_URL = getDomain() + "/ws-message";
  const gamePin = props.match.params["gamePin"];

  const history = useHistory();

  const [usersInLobby, setUsersInLobby] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (usersInLobby.length === 0) {

        }
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }
    fetchData();
  }, [usersInLobby, gamePin]);

  let onConnected = () => {
    // hardcoded sample values:
    if(usersInLobby.length === 0) {
      setUsersInLobby([
      {
        "user": "Günter",
        "score": 1500,
      }, {
          "user": "Rüdiger",
          "score": 600,
        }, {
          "user": "Ueli",
          "score": 2000,
        }, {
          "user": "Thorsten",
          "score": 420,
        }])
    }
    console.log("Connected!!");
  };
  let onDisconnected = () => {
    console.log("disconnect");
  };

  let onMessageReceived = (msg) => {
    console.log("Websocket msg:");
    console.log(msg);
    if (msg.type === "someType") {
    } else if (msg.type === "otherType") {
    }
  };


  let playerListContent = (
    <Container align="center">
      <Title
        order={3}
        color="white"
      >
        loading...
      </Title>
    </Container>
  );

  if (usersInLobby.length !== 0) {
    usersInLobby.sort((a, b) => b.score - a.score);

    playerListContent = (
      <Stack
        justify="flex-start"
        align="stretch"
        spacing="sm"
      >
        {usersInLobby.map((user, index) => (
          <ScoreboardEntry
            key={user.user}
            username={user.user}
            number={index + 1}
            score={user.score}
          />
        ))}
      </Stack>
    );
  }


  return (
    <BaseContainer>
      <SockJsClient
        url={SOCKET_URL}
        topics={[`/topic/lobbies/${gamePin}`]}
        onConnect={onConnected}
        onDisconnect={onDisconnected}
        onMessage={(msg) => onMessageReceived(msg)}
        debug={false}
      />
        <Title color="white">Score</Title>
      <Paper
        radius="md"
        shadow="xl"
        withBorder="true"
        p="lg"
        sx={{ background: "inherit", minWidth: "220px" }}
      >
        {playerListContent}
      </Paper>
    </BaseContainer>
  );
};

export default Score;
