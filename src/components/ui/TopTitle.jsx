import { Title } from "@mantine/core";

const TopTitle = (props) => (
    <Title
        order={2}
        sx={{ color: "lightblue" }}
        {...props}
    >
        {props.children}
    </Title>
);

export default TopTitle;
