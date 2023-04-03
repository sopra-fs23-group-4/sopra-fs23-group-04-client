import { Redirect, Route } from "react-router-dom";

const GameRouter = (props) => {
    return (
        <Route
            exact
            path={`${props.base}`}
        >
            <Redirect to={`${props.base}/dashboard`} />
        </Route>
    );
};

export default GameRouter;
