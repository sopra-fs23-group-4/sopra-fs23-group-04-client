import BaseContainer from "../ui/BaseContainer";
import { Container, Text, PasswordInput, rem, Stack, TextInput } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { RestApi, handleError } from "../../api/RestApi";
import TopTitle from "../ui/TopTitle";

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
            if (error.response.status === 409) {
                error.response.data.message = "this username is already taken";
            }
            console.error(`Something went wrong during the Registration: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <TopTitle>registration</TopTitle>{" "}
            <Container size={250}>
                <Stack>
                    <TextInput
                        label="username:"
                        placeholder="username"
                        radius="lg"
                        size="lg"
                        value={username}
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        sx={{ "& .mantine-TextInput-label": { color: "white" }, marginBottom: "-5%" }}
                    />
                    <Text
                        size="xs"
                        color="white"
                        sx={{ "& .mantine-TextInput-label": { color: "white" } }}
                    >
                        *one word, max. 10 characters
                    </Text>
                    <PasswordInput
                        label="password:"
                        placeholder="password"
                        radius="lg"
                        size="lg"
                        value={password}
                        onChange={(event) => setPassword(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                    <PasswordInput
                        label="repeat password:"
                        placeholder="password"
                        radius="lg"
                        size="lg"
                        value={password2}
                        onChange={(event) => setPassword2(event.currentTarget.value)}
                        sx={{ "& .mantine-PasswordInput-label": { color: "white" } }}
                    />
                </Stack>
            </Container>
            <StandardButton
                sx={{ marginTop: "3%" }}
                w={rem(100)}
                disabled={!username || !password || !password2 || username === "" || password === "" || password2 === "" || password !== password2}
                onClick={() => doRegistration()}
            >
                register
            </StandardButton>
            <StandardButton
                sx={{ marginTop: "20%" }}
                component={Link}
                to="/login"
            >
                back
            </StandardButton>
        </BaseContainer>
    );
};

export default Registration;
