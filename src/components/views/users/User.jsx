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
            }
        }
        fetchData();
    }, [user, username]);

    return (
        <BaseContainer>
            <Title>{user.username}</Title>
        </BaseContainer>
    );
};

export default User;
