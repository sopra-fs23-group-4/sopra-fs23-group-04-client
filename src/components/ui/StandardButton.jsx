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
                height: rem(42),
                width: rem(120),
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
