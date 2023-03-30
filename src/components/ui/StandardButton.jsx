import { Button, rem } from "@mantine/core";

const StandardButton = ({ children }) => (
    <Button
        variant="gradient"
        gradient={{ from: "teal", to: "blue", deg: 60 }}
        size="md"
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
    >
        {children}
    </Button>
);

export default StandardButton;
