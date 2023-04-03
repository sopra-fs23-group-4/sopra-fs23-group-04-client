import { Button, rem } from "@mantine/core";

const StandardButton = (props) => (
    <Button
        variant="gradient"
        gradient={{ from: "#f8af05", to: "#f8af05", deg: 70 }}
        size="md"
        radius="xl"
        styles={(theme) => ({
            root: {
                border: 0,
                paddingTop: rem(5),
                paddingBottom: rem(5),
                paddingLeft: rem(15),
                paddingRight: rem(15),
                display: "inline-block",
                "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: theme.fn.darken("#00acee", 0.05),
                }),
            },
        })}
        sx={{
            color: "black",
            "&:disabled": {
                color: "black",
                backgroundColor: "#f8af05",
                opacity: 0.5,
            },
        }}
        {...props}
    >
        {props.children}
    </Button>
);

export default StandardButton;
