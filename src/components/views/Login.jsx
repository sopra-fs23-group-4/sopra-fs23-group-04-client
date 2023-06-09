import BaseContainer from "components/ui/BaseContainer";
import { Container, Text, PasswordInput, rem, Stack, TextInput } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { handleError, RestApi } from "../../api/RestApi";
import TopTitle from "../ui/TopTitle";

const Login = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doLogin = async (e) => {
        try {
            e.preventDefault();
            await RestApi.login(username, password);
            history.push(`/dashboard`);
        } catch (error) {
            console.error(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <TopTitle>login</TopTitle>{" "}
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
                        placeholder="password"
                        radius="lg"
                        size="lg"
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                </Stack>
            </Container>
            <StandardButton
                sx={{ marginTop: "2%" }}
                w={rem(100)}
                disabled={!username || !password}
                onClick={(e) => doLogin(e)}
            >
                login
            </StandardButton>
            <Text
                align="center"
                color="yellow"
                sx={{ textDecoration: "underline", marginTop: "2%" }}
                w={rem(100)}
                component={Link}
                to="/registration"
            >
                <strong> sign up </strong>
            </Text>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
