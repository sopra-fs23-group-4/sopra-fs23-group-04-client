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

const InGameRouter = (props) => {
    const base = `/game/:gamePin`;
    const SOCKET_URL = getDomain() + "/ws-message";

    const { gamePin, round, categoryIndex } = useParams();
    console.log("gamePin: " + gamePin);
    console.log("Round: " + round);
    console.log("categoryIndex" + categoryIndex);
    const history = useHistory();

    const [timer, setTimer] = useState(null);
    // Lobby State
    const [hostUsername, setHostUsername] = useState("loading...");
    const [usersInLobby, setUsersInLobby] = useState([]);
    const [done, setDone] = useState(false);

    // Prevent Backward Navigation
    history.block((location, action) => {
        if (action === "POP") {
            console.log("prevented backwards navigation");
            // Prevent navigation when the user tries to navigate back
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
    };

    let onMessageReceived = async (msg) => {
        console.log("InGameRouter Websocket:");
        console.log(msg.type);
        console.log(msg);
        // timers
        if (msg.type === "resultTimer") {
            setTimer(msg.timeRemaining);
        } else if (msg.type === "scoreboardTimer") {
            setTimer(msg.timeRemaining);
        } else if (msg.type === "roundTimer") {
            setTimer(msg.timeRemaining);
        } else if (msg.type === "votingTimer") {
            setTimer(msg.timeRemaining);
        }
        // users
        else if (msg.type === "gameUsers") {
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
        // round control
        else if (msg.type === "roundStart") {
            StorageManager.setAnswers(Array(StorageManager.getCategories().length).fill(null));
            StorageManager.setLetter(msg.letter);
            StorageManager.setRound(msg.round);
            history.replace(`/game/${gamePin}/round/${msg.round}/countdown/`);
        } else if (msg.type === "roundEnd") {
            // Board
            setTimer(0);
            //await doDoneWs();
        } else if (msg.type === "votingEnd") {
            // voting
            if (done === false) {
                setDone(true);
                //await doDone();
            }
        }
        // results
        else if (msg.type === "resultNextVote") {
            const nextCategoryIndex = parseInt(categoryIndex) + 1;
            history.replace(`/game/${gamePin}/round/${round}/voting/${nextCategoryIndex}`);
        } else if (msg.type === "resultScoreboard") {
            history.replace(`/game/${gamePin}/round/${round}/score`);
        } else if (msg.type === "resultWinner") {
            history.replace(`/game/${gamePin}/winner`);
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
                    component={Board}
                />
                <Route
                    exact
                    path={`${base}/round/:round/voting/:categoryIndex`}
                    component={Voting}
                />

                <Route
                    exact
                    path={`${base}/round/:round/votingResults/:categoryIndex`}
                    component={VotingResult}
                />
                <Route
                    exact
                    path={`${base}/round/:round/score`}
                    component={Score}
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
