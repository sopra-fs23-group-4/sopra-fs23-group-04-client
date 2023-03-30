import { Button, rem } from "@mantine/core";

const StandardButton = ({ children }) => (
    <Button
        styles={(theme) => ({
            root: {
                backgroundColor: "#00acee",
                border: 0,
                height: rem(42),
                width: rem(120),
                "&:not([data-disabled])": theme.fn.hover({
                    backgroundColor: theme.fn.darken("#00acee", 0.05),
                }),
            },

            leftIcon: {
                marginRight: theme.spacing.md,
            },
        })}
    >
        {children}
    </Button>
);

export default StandardButton;
