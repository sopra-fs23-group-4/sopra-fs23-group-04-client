import BaseContainer from "components/ui/BaseContainer";
import { Container, Group, PasswordInput, rem, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useContext, useState } from "react";
import { handleError, RestApi } from "../../helpers/RestApi";
import { Context } from "../../context";

const Login = () => {
    const context = useContext(Context);
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doLogin = async (e) => {
        try {
            e.preventDefault();
            const user = await RestApi.login(username, password);
            context.setUser(user);
            history.push(`/dashboard`);
        } catch (error) {
            console.error(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Title
                order={1}
                sx={{ color: "white" }}
            >
                Login
            </Title>{" "}
            <Container size={250}>
                <Stack>
                    <TextInput
                        label="username:"
                        placeholder="username"
                        radius="lg"
                        size="lg"
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        sx={{ "& .mantine-TextInput-label": { color: "white" } }}
                    />
                    <PasswordInput
                        label="password:"
                        placeholder="Password"
                        radius="lg"
                        size="lg"
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                </Stack>
            </Container>
            <Group sx={{ paddingTop: 10 }}>
                <StandardButton
                    w={rem(100)}
                    disabled={!username || !password}
                    onClick={(e) => doLogin(e)}
                >
                    Login
                </StandardButton>
                <StandardButton
                    w={rem(100)}
                    component={Link}
                    to="/registration"
                >
                    Sign up
                </StandardButton>
            </Group>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
