import BaseContainer from "../../../ui/BaseContainer";
import { Title, Stack, Paper, Container } from "@mantine/core";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import SockJsClient from "react-stomp";
import { getDomain } from "../../../../helpers/getDomain";
import { Player } from "./Lobby";


const Score = (props) => {
  const SOCKET_URL = getDomain() + "/ws-message";
  const gamePin = props.match.params["gamePin"];

  const history = useHistory();

  const [usersInLobby, setUsersInLobby] = useState([]);

  let onConnected = () => {
    if(usersInLobby.length === 0) {
      setUsersInLobby([
      {
        "id": 1,
        "username": "Günter",
      }, {
          "id": 2,
          "username": "Rüdiger",
        }, {
          "id": 3,
          "username": "Ueli",
        }, {
          "id": 4,
          "username": "Thorsten",
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
    playerListContent = (
      <Stack
        justify="flex-start"
        align="center"
        spacing="sm"
      >
        {usersInLobby.map((user, index) => (
          <Player
            key={user.id}
            username={user.username}
            number={index + 1}
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
        shadow="xl"
        radius="md"
        p="lg"
        sx={{ background: "#00acee", minWidth: "220px" }}
      >
        {playerListContent}
      </Paper>
    </BaseContainer>
  );
};

export default Score;
