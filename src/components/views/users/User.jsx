import BaseContainer from "../../ui/BaseContainer";
import { useEffect, useState } from "react";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { Title } from "@mantine/core";

const User = (props) => {
    const username = props.match.params["username"];

    const [user, setUser] = useState({ username: "" });

    useEffect(() => {
        async function fetchData() {
            try {
                if (user.username === "") {
                    // real code
                    let userResponse = await RestApi.getUserByUsername(username);
                    setUser(userResponse);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }
        fetchData();
    }, [user]);

    return (
        <BaseContainer>
            <Title>{username}</Title>
        </BaseContainer>
    );
};
