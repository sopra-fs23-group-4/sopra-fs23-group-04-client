import PropTypes from "prop-types";
import { Box, Container, Stack } from "@mantine/core";

const BaseContainer = ({ children }) => (
    <Box>
        <Container size="sm">
            <Stack align="center">{children}</Stack>
        </Container>
    </Box>
);

BaseContainer.propTypes = {
    children: PropTypes.node,
};

export default BaseContainer;
