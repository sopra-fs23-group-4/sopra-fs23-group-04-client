import BaseContainer from "../ui/BaseContainer";
import { Container, Stack, Title } from "@mantine/core";

const Dashboard = () => {
    return (
        <BaseContainer>
            <Container size="sm">
                <Stack align="center">
                    <Title
                        order={1}
                        sx={{ color: "white" }}
                    >
                        Welcome
                    </Title>{" "}
                </Stack>
            </Container>
        </BaseContainer>
    );
};

export default Dashboard;
