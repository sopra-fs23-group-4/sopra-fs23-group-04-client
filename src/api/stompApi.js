import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {getDomain} from "../helpers/getDomain";

export function defer() {
  let _resolve, _reject;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  return Object.freeze(
    Object.create(
      {},
      {
        resolve: {
          value: _resolve,
          enumerable: true,
        },
        reject: {
          value: _reject,
          enumerable: true,
        },
        promise: {
          value: promise,
          enumerable: true,
        },
      },
    ),
  );
}

export class StompApi {
  constructor() {
    this.listeners = [];
    this._connected = false;
    this._registered = false;
    this._disconnectCallbacks = [];
    this._registerCallbacks = [];
    this._messageCallbacks = {};
  }

  join(listener) {
    this.listeners.push(listener);
  }

  leave(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  startGame(lobbyId) {
    this.send(`/app/lobbies/${lobbyId}/start-game`);
  }

  nextRound(lobbyId) {
    this.send(`/app/lobbies/${lobbyId}/next-round`);
  }

  endRound(lobbyId) {
    this.send(`/app/lobbies/${lobbyId}/end-round`);
  }

  isConnected() {
    return this._connected;
  }

  isRegistered() {
    return this._registered;
  }

  async connect(lobbyId) {
    const deferred = defer();
    try {
      this.sock.close();
    } catch {}

    this.sock = new SockJS(getDomain() + `/ws`);

    this.stomp = Stomp.over(this.sock);
    this.stomp.reconnect_delay = 5000;

    this.stomp.debug = this._debug;
    this.stomp.connect(
      {},
      () => {
        this._connected = true;
        this.subscribe(`/topic/lobbies/${lobbyId}`, (r) => this._handleMessage(r));

        deferred.resolve();
      },
      () => {
        deferred.reject();
      },
    );

    this.sock.onclose = () => {
      this._handleDisconnect("Socket closed.");
    };
    this.sock.onerror = (e) => this._handleError(e);

    return deferred.promise;
  }

  disconnect(reason) {
    try {
      this.stomp.disconnect(() => this._handleDisconnect(reason), {});
    } catch {}
  }

  subscribe(channel, callback) {
    this.stomp.subscribe(channel, (r) => callback(this._stripResponse(r)));
  }

  onRegister(callback) {
    this._registerCallbacks.push(callback);
  }

  clearMessageSubscriptions() {
    this._messageCallbacks = {};
  }

  onDisconnect(callback) {
    this._disconnectCallbacks.push(callback);
  }

  clearDisconnectSubscriptions() {
    this._disconnectCallbacks = [];
  }

  onLobbyMessage(channel, callback) {
    if (!this._messageCallbacks.hasOwnProperty(channel)) {
      this._messageCallbacks[channel] = [];
    }
    this._messageCallbacks[channel].push(callback);
  }

  send(message, payload) {
    if (payload) {
      this.stomp.send(message, {}, payload);
    } else {
      this.stomp.send(message);
    }
  }

  _handleMessage(info) {
    const msg = info.msg;
    if (msg.type === "playerJoin") {
      this._handlePlayerJoinMessage(info);
    }
  }

  _handleError(error) {
    console.error(error);
    this._handleDisconnect("Socket error.");
  }

  _handleDisconnect(reason) {
    this._connected = false;
    for (const callback of this._disconnectCallbacks) {
      callback(reason);
    }
  }

  _handlePlayerJoinMessage(payload) {
    const info = payload.msg;
    const data = { name: info.name };
    const messageEvent = {
      channel: info.channel,
      type: "result",
      data,
    };
    this.notify(messageEvent);
  }
  _stripResponse(response) {
    const msg = JSON.parse(response.body);
    const channel = response.headers.destination;
    const lobbyChannel = channel.replace(/.+\/lobby\/.+\//i, "/");
    return { msg, channel, lobbyChannel };
  }

  _debug(message) {
    console.log("Debug: " + message);
  }

  notify(event) {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        console.log("Error");
      }
    }
  }
}
