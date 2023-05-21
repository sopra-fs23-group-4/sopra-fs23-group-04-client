import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { StorageManager } from "../../../helpers/storageManager";
import InGameRouter from "../routers/InGameRouter";

export const InGameGuard = (props) => {
    const gamePin = props.match.params["gamePin"];
    if (StorageManager.getGamePin() && StorageManager.getGamePin() === gamePin) {
        return <InGameRouter />;
    }
    return <Redirect to="/game" />;
};

InGameGuard.propTypes = {
    children: PropTypes.node,
};
