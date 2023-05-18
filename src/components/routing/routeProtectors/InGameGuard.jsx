import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { StorageManager } from "../../../helpers/storageManager";

export const InGameGuard = (props) => {
    if (StorageManager.getGamePin()) {
        return props.children;
    }
    return <Redirect to="/dashboard" />;
};

InGameGuard.propTypes = {
    children: PropTypes.node,
};
