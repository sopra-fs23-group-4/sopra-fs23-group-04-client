import { Redirect, Route, Switch } from "react-router-dom";
import Lobby from "../../views/game/[game_id]/Lobby";
import Board from "../../views/game/[game_id]/Board";
import Answer from "../../views/game/[game_id]/Answer";
import Letter from "../../views/game/[game_id]/Letter";
import Voting from "../../views/game/[game_id]/Voting";
import VotingResult from "../../views/game/[game_id]/VotingResult";
import Score from "../../views/game/[game_id]/Score";
import Winner from "../../views/game/[game_id]/Winner";

const InGameRouter = () => {
    const base = `/game/:gamePin`;

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
                path={`${base}/round/:round/letter`}
                component={Letter}
            />
            <Route
                exact
                path={`${base}/round/:round/board`}
                component={Board}
            />
            <Route
                exact
                path={`${base}/round/:round/board/:answerIndex`}
                component={Answer}
            />
            <Route
                exact
                path={`${base}/round/:round/voting/:categoryIndex`}
                component={Voting}
            />

            <Route
                exact
                path={`${base}/round/:round/votingResults/:categoryIndex`}
                component={VotingResult}
            />
            <Route
                exact
                path={`${base}/round/:round/score`}
                component={Score}
            />
            <Route
                exact
                path={`${base}/winner`}
                component={Winner}
            />
            <Route path={`${base}`}>
                <Redirect to={`/Dashboard`} />
            </Route>
        </Switch>
    );
};

export default InGameRouter;
