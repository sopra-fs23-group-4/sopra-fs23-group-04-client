import BaseContainer from "../ui/BaseContainer";
import { Container, Group, PasswordInput, rem, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { RestApi, handleError } from "../../helpers/RestApi";

const Registration = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const doRegistration = async () => {
        try {
            await RestApi.registration(username, password);
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during the Registration: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
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
                        sx={{ "& .mantine-TextInput-label": { color: "white" } }}
                    />
                    <PasswordInput
                        label="password:"
                        placeholder="Password"
                        radius="lg"
                        size="lg"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                    <PasswordInput
                        label="repeat password:"
                        placeholder="Password"
                        radius="lg"
                        size="lg"
                        value={password2}
                        onChange={(event) => setPassword2(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                </Stack>
            </Container>
            <Group sx={{ paddingTop: 10 }}>
                <StandardButton
                    w={rem(100)}
                    component={Link}
                    to="/login"
                >
                    Back
                </StandardButton>
                <StandardButton
                    w={rem(100)}
                    disabled={!username || !password || !password2 || username === "" || password === "" || password2 === "" || password !== password2}
                    onClick={() => doRegistration()}
                >
                    Register
                </StandardButton>
            </Group>
        </BaseContainer>
    );
};

export default Registration;
