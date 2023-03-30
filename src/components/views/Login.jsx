import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useHistory } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { Button, Container, Group, LoadingOverlay, PasswordInput, Stack, TextInput, Title } from "@mantine/core";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
    return (
        <div className="login field">
            <label className="login label">{props.label}</label>
            <input className="login input" placeholder="enter here.." value={props.value} onChange={(e) => props.onChange(e.target.value)} />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Login = (props) => {
    const history = useHistory();
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, name });
            const response = await api.post("/users", requestBody);

            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem("token", user.token);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <LoadingOverlay />
            <Container size="sm">
                <Stack align="center">
                    <Title order={1} sx={{ color: "white", padding: 5 }}>
                        Login
                    </Title>{" "}
                    <Container size={200}>
                        <Stack spacing="lg"></Stack>
                    </Container>
                    <Group sx={{ paddingTop: 10 }}>
                        <Button size="md">Login</Button>
                        <Button size="md">sign up</Button>
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
