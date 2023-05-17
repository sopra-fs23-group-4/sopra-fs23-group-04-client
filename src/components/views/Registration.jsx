import BaseContainer from "../ui/BaseContainer";
import { Container, Text, PasswordInput, rem, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import { useContext, useState } from "react";
import { RestApi, handleError } from "../../helpers/RestApi";
import { Context } from "../../context";

const Registration = () => {
    const history = useHistory();
    const context = useContext(Context);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const doRegistration = async () => {
        try {
            const user = await RestApi.registration(username, password);
            context.setUser(user);
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
            <Title
                order={1}
                sx={{ color: "white" }}
            >
                registration
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
