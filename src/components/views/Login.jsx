import BaseContainer from "components/ui/BaseContainer";
import { Container, Group, LoadingOverlay, PasswordInput, Rating, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const Login = (props) => {
    return (
        <BaseContainer>
            <Container size="sm">
                <Stack align="center">
                    <Title order={1} sx={{ color: "white" }}>
                        Login
                    </Title>{" "}
                    <Container size={250}>
                        <Stack>
                            <TextInput
                                label="username:"
                                sx={{ ["& .mantine-TextInput-label"]: { color: "white" } }}
                                placeholder="username"
                                radius="lg"
                                size="xl"
                            />
                            <PasswordInput
                                label="password:"
                                sx={{ ["& .mantine-PasswordInput-label"]: { color: "white" } }}
                                placeholder="Password"
                                radius="lg"
                                size="xl"
                            />
                        </Stack>
                    </Container>
                    <Group sx={{ paddingTop: 10 }}>
                        <StandardButton>Login</StandardButton>
                        <StandardButton>sign up</StandardButton>
                    </Group>
                </Stack>
            </Container>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
