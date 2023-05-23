import { Title } from "@mantine/core";

const TopTitle = (props) => (
    <Title
        order={2}
        sx={{ color: "white" }}
        {...props}
    >
        {props.children}
    </Title>
);

export default TopTitle;
