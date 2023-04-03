import BaseContainer from "../ui/BaseContainer";
import { Container, Group, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { api, handleError } from "../../helpers/api";
import User from "../../models/User";
import { generalLoginProcedure } from "./Login";

const Registration = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.post("/users", requestBody);

            const user = new User(response.data);

            generalLoginProcedure(user);
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during the Registration: \n${handleError(error)}`);
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
                        Registration
                    </Title>{" "}
                    <Container size={250}>
                        <Stack>
                            <TextInput
                                label="username:"
                                placeholder="username"
                                radius="lg"
                                size="lg"
                                value={username}
                                onChange={(event) => setUsername(event.currentTarget.value)}
                            />
                            <PasswordInput
                                label="password:"
                                placeholder="Password"
                                radius="lg"
                                size="lg"
                                value={password}
                                onChange={(event) => setPassword(event.currentTarget.value)}
                            />
                            <PasswordInput
                                label="repeat password:"
                                placeholder="Password"
                                radius="lg"
                                size="lg"
                                value={password2}
                                onChange={(event) => setPassword2(event.currentTarget.value)}
                            />
                        </Stack>
                    </Container>
                    <Group sx={{ paddingTop: 10 }}>
                        <StandardButton
                            disabled={!username || !password || !password2 || username === "" || password === "" || password2 === "" || password !== password2}
                            onClick={() => doRegistration()}
                        >
                            Register
                        </StandardButton>
                        <StandardButton
                            component={Link}
                            to="/login"
                        >
                            Back
                        </StandardButton>
                    </Group>
                </Stack>
            </Container>
        </BaseContainer>
    );
};

export default Registration;
