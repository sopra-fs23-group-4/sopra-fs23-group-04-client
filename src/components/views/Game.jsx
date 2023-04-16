import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../helpers/RestApi";
import User from "../../models/User";
import React, { useEffect, useState } from "react";
import { Loader, PinInput, Title, Text } from "@mantine/core";
import StandardButton from "../ui/StandardButton";

const Game = () => {
    const history = useHistory();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUserId = await RestApi.getUser();
                setUser(new User(responseUserId.data));
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }
        fetchData();
    }, [user]);

    let contentUserName = <Loader />;
    if (user) {
        contentUserName = user.username;
    }

    return (
        <BaseContainer>
            <Title color="white">{contentUserName}</Title>
            <Text color="white">create a new Game as HOST:</Text>
            <StandardButton>Create Game</StandardButton>
            <Text
                color="white"
                sx={{ marginTop: "2%" }}
            >
                Join existing Game with PIN:
            </Text>
            <PinInput></PinInput>
            <StandardButton>Join Game{"   "}</StandardButton>
            <StandardButton
                sx={{ marginTop: "5%" }}
                onClick={() => history.push("/dashboard")}
            >
                Back
            </StandardButton>
        </BaseContainer>
    );
};

export default Game;
