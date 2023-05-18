import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { StorageManager } from "../../../helpers/storageManager";
import InGameRouter from "../routers/InGameRouter";

export const InGameGuard = (props) => {
    const gamePin = props.match.params["gamePin"];
    if (StorageManager.getGamePin() && StorageManager.getGamePin() === gamePin) {
        return <InGameRouter urlGamePin={gamePin} />;
    }
    return <Redirect to="/dashboard" />;
};

InGameGuard.propTypes = {
    children: PropTypes.node,
};
