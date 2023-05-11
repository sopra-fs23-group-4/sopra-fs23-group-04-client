import { Redirect, Route, Switch } from "react-router-dom";
import Edit from "../../views/profile/Edit";
import Quote from "../../views/profile/edit/Quote";

const ProfileRouter = (props) => {
    return (
        <Switch>
            <Route
                exact
                path={`${props.base}/edit`}
                component={Edit}
            />
            <Route
                exact
                path={`${props.base}/edit/quote`}
                component={Quote}
            />
            <Route
                exact
                path={`${props.base}`}
            >
                <Redirect to={`${props.base}/edit`} />
            </Route>
        </Switch>
    );
};

export default ProfileRouter;
