import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocket = (lobbyId, onGameStart) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS('/game-websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket.');

      // Subscribe to the game start topic for the specific lobby
      stompClient.subscribe(`/topic/game-start/${lobbyId}`, (message) => {
        onGameStart(message.body);
      });

      setClient(stompClient);
    };

    stompClient.onStompError = (frame) => {
      console.error(`Error in WebSocket connection: ${frame.body}`);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [lobbyId, onGameStart]);

  const sendMessage = (destination, message) => {
    if (client) {
      client.publish({ destination, body: message });
    }
  };

  return { sendMessage };
};

export default useWebSocket;