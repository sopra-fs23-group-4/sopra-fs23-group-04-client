import { Paper } from "@mantine/core";

const PaperBox = (props) => (
    <Paper
        align="center"
        sx={{ background: "inherit", minWidth: "220px", border: "3px solid azure", maxWidth: "90%" }}
        radius="md"
        shadow="xl"
        spacing="xs"
        {...props}
    >
        {props.children}
    </Paper>
);

//bg="rgba(0, 255, 0, .1)"

export default PaperBox;
