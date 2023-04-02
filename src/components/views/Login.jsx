import BaseContainer from "components/ui/BaseContainer";
import { Container, Group, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import User from "../../models/User";
import { api, handleError } from "../../helpers/api";

const Login = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.put("/login", requestBody);

            const user = new User(response.data);
            localStorage.setItem("token", user.token);
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Container size="sm">
                <Stack align="center">
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
                            />
                            <PasswordInput
                                label="password:"
                                placeholder="Password"
                                radius="lg"
                                size="lg"
                                onChange={(event) => setPassword(event.currentTarget.value)}
                            />
                        </Stack>
                    </Container>
                    <Group sx={{ paddingTop: 10 }}>
                        <StandardButton
                            disabled={!username || !password}
                            onClick={() => doLogin()}
                        >
                            Login
                        </StandardButton>
                        <StandardButton
                            component={Link}
                            to="/registration"
                        >
                            Sign up
                        </StandardButton>
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
