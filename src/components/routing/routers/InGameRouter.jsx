import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Lobby from "../../views/game/[game_id]/Lobby";
import Board from "../../views/game/[game_id]/Board";
import Countdown from "../../views/game/[game_id]/Countdown";
import Voting from "../../views/game/[game_id]/Voting";
import VotingResult from "../../views/game/[game_id]/VotingResult";
import Score from "../../views/game/[game_id]/Score";
import Winner from "../../views/game/[game_id]/Winner";
import { useEffect } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";

const InGameRouter = (props) => {
    const base = `/game/:gamePin`;
    const gamePin = props.urlGamePin;

    const history = useHistory();

    history.block((location, action) => {
        if (action === "POP") {
            console.log("prevented backwards navigation");
            // Prevent navigation when the user tries to navigate back
            return false;
        }
    });

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

    return (
        <Switch>
            <Route
                exact
                path={`${base}/lobby`}
                component={Lobby}
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
    );
};

export default InGameRouter;
