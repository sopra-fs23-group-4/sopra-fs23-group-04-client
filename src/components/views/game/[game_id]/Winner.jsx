import BaseContainer from "../../../ui/BaseContainer";
import { Avatar, Stack, Text, Title } from "@mantine/core";
import React from "react";

const Winner = () => {
    return (
        <BaseContainer>
            <Title
                align="center"
                order={1}
                sx={{ color: "white" }}
            >
                Winner
            </Title>
            <Stack
                style={{ width: "80%" }}
                align="center"
                spacing="xs"
            >
                <Title
                    align="center"
                    order={1}
                    sx={{ color: "white" }}
                >
                    {"username"}
                </Title>
                <Avatar
                    src={"picture"}
                    alt="click to change"
                    size="xl"
                />
                <Text
                    align="center"
                    size="md"
                    color="white"
                    fw={500}
                    sx={{ width: "80%", marginBottom: "2%" }}
                >
                    {"quote"}
                </Text>
            </Stack>
        </BaseContainer>
    );
};

export default Winner;
