import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Registration from "../../views/Registration";
import { DashboardGuard } from "../routeProtectors/DashboardGuard";
import Dashboard from "../../views/Dashboard";
import ProfileRouter from "./ProfileRouter";
import GameRouter from "./GameRouter";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route
                    exact
                    path="/login"
                >
                    <LoginGuard>
                        <Login />
                    </LoginGuard>
                </Route>

                <Route
                    exact
                    path="/registration"
                >
                    <LoginGuard>
                        <Registration />
                    </LoginGuard>
                </Route>

                <Route
                    exact
                    path="/dashboard"
                >
                    <DashboardGuard>
                        <Dashboard />
                    </DashboardGuard>
                </Route>

                <Route path="/profile">
                    <DashboardGuard>
                        <ProfileRouter base="/profile" />
                    </DashboardGuard>
                </Route>

                <Route path="/game">
                    <DashboardGuard>
                        <GameRouter base="/game" />
                    </DashboardGuard>
                </Route>

                <Route path="/">
                    <Redirect to="/login" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

export default AppRouter;
