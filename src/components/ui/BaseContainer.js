import PropTypes from "prop-types";
import { Box } from "@mantine/core";

const BaseContainer = ({ children }) => <Box>{children}</Box>;

BaseContainer.propTypes = {
    children: PropTypes.node,
};

export default BaseContainer;
