import { Redirect, Route, Switch } from "react-router-dom";
import Quote from "../../views/profile/edit/Quote";
import User from "../../views/users/User";
import { StorageManager } from "../../../helpers/storageManager";

const ProfileRouter = (props) => {
    const gamePinIfExists = StorageManager.getGamePin();
    return (
        <Switch>
            {/*            <Route
                exact
                path={`${props.base}/edit`}
                component={Edit}
            />*/}
            <Route
                exact
                path={`${props.base}/edit/quote`}
                component={Quote}
            />
            <Route
                exact
                path={`${props.base}/:username`}
                component={User}
            />
            <Route path={`${props.base}`}>
                <Redirect to={gamePinIfExists ? `/game/${gamePinIfExists}/lobby` : "/dashboard"} />
            </Route>
        </Switch>
    );
};

export default ProfileRouter;
