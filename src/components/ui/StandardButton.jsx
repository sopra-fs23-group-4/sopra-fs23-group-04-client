import { Button, rem } from "@mantine/core";

const StandardButton = (props) => (
    <Button
        {...props}
        variant="gradient"
        gradient={{ from: "#f8af05", to: "#f8af05", deg: 70 }}
        size="md"
        radius="xl"
        styles={(theme) => ({
            root: {
                border: 0,
                paddingLeft: rem(20),
                paddingRight: rem(20),
                height: rem(42),
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
    >
        {props.children}
    </Button>
);

export default StandardButton;
