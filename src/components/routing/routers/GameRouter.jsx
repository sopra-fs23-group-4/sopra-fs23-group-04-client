import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Game from "../../views/Game";
import Categories from "../../views/game/Categories";
import Settings from "../../views/game/Settings";
import Board from "../../views/game/[game_id]/Board";
import Answer from "../../views/game/[game_id]/Answer";

const GameRouter = (props) => {
    return (
        <BrowserRouter>
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
                    exact
                    path={`${props.base}/board`}
                    component={Board}
                />
                <Route
                    exact
                    path={`${props.base}/:gameId/board/:answerIndex`}
                    component={Answer}
                />
                <Route
                    exact
                    path={`${props.base}`}
                >
                    <Redirect to={`${props.base}`} />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default GameRouter;
