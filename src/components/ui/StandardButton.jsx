import { Button, rem } from "@mantine/core";

const StandardButton = (props) => (
    <Button
        variant="filled"
        color="yellow"
        size="md"
        radius="xl"
        styles={() => ({
            root: {
                color: "black",
                paddingLeft: rem(15),
                paddingRight: rem(15),
                "&:disabled": {
                    color: "inherit",
                    backgroundColor: "#f8af05",
                    opacity: 0.5,
                },
            },
        })}
        {...props}
    >
        {props.children}
    </Button>
);

export default StandardButton;
