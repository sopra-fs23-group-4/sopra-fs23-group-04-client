import BaseContainer from "../ui/BaseContainer";
import { Container, Group, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import { Link } from "react-router-dom";

const Registration = () => {
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
                                size="xl"
                            />
                            <PasswordInput
                                label="password:"
                                placeholder="Password"
                                radius="lg"
                                size="xl"
                            />
                            <PasswordInput
                                label="repeat password:"
                                placeholder="Password"
                                radius="lg"
                                size="xl"
                            />
                        </Stack>
                    </Container>
                    <Group sx={{ paddingTop: 10 }}>
                        <StandardButton
                            component={Link}
                            to="/dashboard"
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
