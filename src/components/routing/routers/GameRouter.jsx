import { Redirect, Route, Switch } from "react-router-dom";
import Game from "../../views/Game";

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
                path={`${props.base}`}
            >
                <Redirect to={`${props.base}`} />
            </Route>
        </Switch>
    );
};

export default GameRouter;
