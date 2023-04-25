import { Redirect, Route, Switch } from "react-router-dom";
import Lobby from "../../views/game/[game_id]/Lobby";
import Board from "../../views/game/[game_id]/Board";
import Answer from "../../views/game/[game_id]/Answer";
import Letter from "../../views/game/[game_id]/Letter";

const InGameRouter = () => {
    const base = "/game/:gamePin";

    return (
        <Switch>
            <Route
                exact
                path={`${base}/lobby`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/countdown`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/Lobby`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/round/:round/letter`}
                component={Letter}
            />
            <Route
                exact
                path={`${base}/round/:round/board`}
                component={Board}
            />
            <Route
                exact
                path={`${base}/round/:round/board/:answerIndex`}
                component={Answer}
            />
            <Route
                exact
                path={`${base}/round/:round/voting`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/round/:round/votingresults`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/round/:round/score`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/winner`}
                component={Lobby}
            />
            <Route path={`${base}`}>
                <Redirect to={`${base}/lobby`} />
            </Route>
        </Switch>
    );
};

export default InGameRouter;
