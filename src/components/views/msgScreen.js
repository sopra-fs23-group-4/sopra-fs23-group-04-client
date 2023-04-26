
import React, { useState } from 'react';
import SockJsClient from 'react-stomp';

const SOCKET_URL = 'http://localhost:8080/ws-message';

const JoinScreen = () => {
  const [message, setMessage] = useState('You server message here.');

  let onConnected = () => {
    console.log("Connected!!")
  }
  let disconnect = () => {
    console.log("disconnect")
  }

  let onMessageReceived = (msg) => {
    setMessage(msg.name);
  }


  return (
    <div>
      <SockJsClient
        url={SOCKET_URL}
        topics={['/topic/message']}
        onConnect={onConnected}
        onDisconnect={disconnect()}
        onMessage={msg => onMessageReceived(msg)}
        debug={false}
      />
      <div>{message}</div>
      <h2>Welcome to the game lobby!</h2>
      {/* Add your join form and other UI components here */}
    </div>
  );
}

export default JoinScreen;