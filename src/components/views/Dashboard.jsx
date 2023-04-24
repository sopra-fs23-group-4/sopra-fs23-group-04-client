import { Avatar, Button, Stack, Text, Title } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import React from "react";
import StandardButton from "../ui/StandardButton";
import { Edit as EditIcon } from "tabler-icons-react";
import { storageManager } from "../../helpers/storageManager";

const Dashboard = () => {
    const history = useHistory();

    const username = storageManager.getUsername();
    const quote = storageManager.getQuote();
    const picture = storageManager.getPicture();

    const doLogout = async () => {
        storageManager.clearAll();
        history.push("/login");
    };

    /*    const [opened, { toggle, close }] = useDisclosure(false);*/

    return (
        <BaseContainer>
            <Stack
                style={{ width: "80%" }}
                align="center"
                spacing="xs"
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                    /*onClick={toggle}*/
                >
                    {username}{" "}
                    {/*                    <EditIcon
                        color="#f8af05"
                        size={22}
                    />*/}
                </Title>
                {/*
                <Dialog
                    opened={opened}
                    withCloseButton
                    transition="slide-up"
                    transitionDuration={300}
                    transitionTimingFunction="ease"
                    onClose={close}
                    size="lg"
                    radius="md"
                    sx={{ width: "260px", color: "black", marginBottom: "2%" }}
                >
                    <Text
                        size="sm"
                        mb="sm"
                        weight={500}
                    >
                        Change username:
                    </Text>

                    <Group align="flex-end">
                        <TextInput
                            placeholder="enter new username"
                            sx={{ flex: 1 }}
                        />
                        <StandardButton
                            size="sm"
                            onClick={close}
                        >
                            save
                        </StandardButton>
                    </Group>
                </Dialog>
*/}
                <Avatar
                    src={picture}
                    alt="click to change"
                    size="xl"
                    // onClick={() => history.push("/profile/edit/picture")}
                />
                <Text
                    align="center"
                    size="md"
                    color="white"
                    fw={500}
                    sx={{ width: "80%", marginBottom: "2%" }}
                    onClick={() => history.push("/profile/edit/quote")}
                >
                    {quote}{" "}
                    <EditIcon
                        color="#f8af05"
                        size={18}
                    />
                </Text>
            </Stack>
            <Button
                onClick={() => history.push("/game/")}
                variant="gradient"
                gradient={{ from: "#f8af05", to: "#f8af05", deg: 105 }}
                radius="xl"
                size="lg"
                sx={{ width: "140px", color: "black", marginBottom: "2%" }}
            >
                PLAY
            </Button>
            <StandardButton
                onClick={() => doLogout()}
                sx={{ marginTop: "5%" }}
            >
                Logout{" "}
            </StandardButton>
        </BaseContainer>
    );
};
export default Dashboard;
