import { Redirect, Route, Switch, useHistory, useParams } from "react-router-dom";
import Lobby from "../../views/game/[game_id]/Lobby";
import Board from "../../views/game/[game_id]/Board";
import Countdown from "../../views/game/[game_id]/Countdown";
import Voting from "../../views/game/[game_id]/Voting";
import VotingResult from "../../views/game/[game_id]/VotingResult";
import Score from "../../views/game/[game_id]/Score";
import Winner from "../../views/game/[game_id]/Winner";
import { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";
import SockJsClient from "react-stomp";
import { StorageManager } from "../../../helpers/storageManager";
import { getDomain } from "../../../helpers/getDomain";

const InGameRouter = () => {
    const base = `/game/:gamePin`;
    const SOCKET_URL = getDomain() + "/ws-message";

    const { gamePin, round, categoryIndex } = useParams();
    const history = useHistory();

    const [msg, setMsg] = useState({ type: "null" });
    // Lobby State
    const [hostUsername, setHostUsername] = useState("loading...");
    const [usersInLobby, setUsersInLobby] = useState([]);

    // Prevent Backward Navigation
    history.block((location, action) => {
        if (action === "POP") {
            console.log("prevented backwards navigation");
            return false;
        }
    });

    // Leave on Tab Close
    useEffect(() => {
        const handleTabClose = () => {
            RestApi.leaveGame(gamePin)
                .then(() => {
                    // Handle successful API call if needed
                })
                .catch((error) => {
                    console.error(`Something went wrong while leaving the game: \n${handleError(error)}`);
                });
        };

        window.addEventListener("unload", handleTabClose);

        return () => {
            window.removeEventListener("unload", handleTabClose);
        };
    }, [gamePin]);

    // Websocket
    const onConnected = () => {
        console.log("Connected!!");
    };
    const onDisconnected = () => {
        console.log("disconnect");
        // RestApi.leaveGame(gamePin)
        //     .then(() => {
        //         // Handle successful API call if needed
        //     })
        //     .catch((error) => {
        //         console.error(`Something went wrong while leaving the game: \n${handleError(error)}`);
        //     });
    };

    let onMessageReceived = async (msg) => {
        console.log("InGameRouter Websocket:");
        console.log("Message Type:" + msg.type);
        console.log(msg);

        // users
        if (msg.type === "gameUsers") {
            if (msg.hostUsername !== null) {
                if (hostUsername !== msg.hostUsername) {
                    setHostUsername(msg.hostUsername);
                }
                setUsersInLobby(msg.usernames);
            }
        }
        // fact
        else if (msg.type === "fact") {
            StorageManager.setFact(msg.fact);
        }
        // round start
        else if (msg.type === "roundStart") {
            StorageManager.setAnswers(Array(StorageManager.getCategories().length).fill(null));
            StorageManager.setLetter(msg.letter);
            StorageManager.setRound(msg.round);
            history.replace(`/game/${gamePin}/round/${msg.round}/countdown/`);
        }
        // re-routs
        else if (msg.type === "resultNextVote") {
            const nextCategoryIndex = parseInt(categoryIndex) + 1;
            history.replace(`/game/${gamePin}/round/${round}/voting/${nextCategoryIndex}`);
        } else if (msg.type === "resultScoreboard") {
            history.replace(`/game/${gamePin}/round/${round}/score`);
        } else if (msg.type === "resultWinner") {
            history.replace(`/game/${gamePin}/winner`);
        }
        // page specific handling
        else {
            setMsg(msg);
        }
    };

    return (
        <>
            <SockJsClient
                url={SOCKET_URL}
                topics={[`/topic/lobbies/${gamePin}`]}
                onConnect={onConnected}
                onDisconnect={onDisconnected}
                onMessage={(msg) => onMessageReceived(msg)}
                debug={false}
            />
            <Switch>
                <Route
                    exact
                    path={`${base}/lobby`}
                    render={(props) => (
                        <Lobby
                            {...props}
                            hostUsername={hostUsername}
                            usersInLobby={usersInLobby}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${base}/round/:round/countdown`}
                    component={Countdown}
                />
                <Route
                    exact
                    path={`${base}/round/:round/board`}
                    render={(props) => (
                        <Board
                            {...props}
                            websocketMsg={msg}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${base}/round/:round/voting/:categoryIndex`}
                    render={(props) => (
                        <Voting
                            {...props}
                            websocketMsg={msg}
                        />
                    )}
                />

                <Route
                    exact
                    path={`${base}/round/:round/votingResults/:categoryIndex`}
                    render={(props) => (
                        <VotingResult
                            {...props}
                            websocketMsg={msg}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${base}/round/:round/score`}
                    render={(props) => (
                        <Score
                            {...props}
                            websocketMsg={msg}
                        />
                    )}
                />
                <Route
                    exact
                    path={`${base}/winner`}
                    component={Winner}
                />
                <Route path={`${base}`}>
                    <Redirect to={`/Dashboard`} />
                </Route>
            </Switch>
        </>
    );
};

export default InGameRouter;
