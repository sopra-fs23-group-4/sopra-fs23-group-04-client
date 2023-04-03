import { Redirect, Route } from "react-router-dom";

const GameRouter = (props) => {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Route
                exact
                path={`${props.base}`}
            >
                <Redirect to={`${props.base}/dashboard`} />
            </Route>
        </div>
    );
};

export default GameRouter;
