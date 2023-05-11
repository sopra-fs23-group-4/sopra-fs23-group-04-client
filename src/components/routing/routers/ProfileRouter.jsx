import { Redirect, Route, Switch } from "react-router-dom";
import Edit from "../../views/profile/Edit";
import Quote from "../../views/profile/edit/Quote";
import User from "../../views/users/User";

const ProfileRouter = (props) => {
    return (
        <Switch>
            <Route
                exact
                path={`${props.base}/:username`}
                component={User}
            />
            {/*            <Route
                exact
                path={`${props.base}/:username/edit`}
                component={Edit}
            />*/}
            <Route
                exact
                path={`${props.base}/:username/edit/quote`}
                component={Quote}
            />
            <Route path={`${props.base}`}>
                <Redirect to={`${props.base}/:username`} />
            </Route>
        </Switch>
    );
};

export default ProfileRouter;
