import { Redirect, Route, Switch } from "react-router-dom";
import Game from "../../views/Game";
import Categories from "../../views/game/Categories";
import Settings from "../../views/game/Settings";
import { InGameGuard } from "../routeProtectors/InGameGuard";

const GameRouter = (props) => {
    return (
        <Switch>
            <Route
                exact
                path={`${props.base}`}
                component={Game}
            />
            <Route
                exact
                path={`${props.base}/categories`}
                component={Categories}
            />
            <Route
                exact
                path={`${props.base}/settings`}
                component={Settings}
            />
            <Route
                path={`${props.base}/:gamePin`}
                component={InGameGuard}
            />
            <Route path={`${props.base}`}>
                <Redirect to={`${props.base}`} />
            </Route>
        </Switch>
    );
};

export default GameRouter;
