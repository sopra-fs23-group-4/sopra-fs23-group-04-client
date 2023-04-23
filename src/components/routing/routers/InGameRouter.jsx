import { Redirect, Route, Switch } from "react-router-dom";
import Lobby from "../../views/game/[game_id]/Lobby";

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
                path={`${base}/letter`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/board`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/answer`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/voting`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/votingresults`}
                component={Lobby}
            />
            <Route
                exact
                path={`${base}/score`}
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
