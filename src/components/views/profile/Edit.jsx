/*import { Avatar, Text, Title } from "@mantine/core";
import StandardButton from "../../ui/StandardButton";
import { Link, useHistory } from "react-router-dom";
import BaseContainer from "../../ui/BaseContainer";
import { useEffect, useState } from "react";
import { Edit as EditIcon } from "tabler-icons-react";*/

const Edit = () => {
    /*    const history = useHistory();
    const [user, setUser] = useState(null);

    const id = sessionStorage.getItem("user_id");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);

                await new Promise((resolve) => setTimeout(resolve, 1000)); // remove?

                setUser(response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [id, user]);

    return (
        <BaseContainer>
            <Title
                align="center"
                order={1}
                color="white"
                //onClick={change to inputfield and add save button next to it?}
            >
                userName
                <EditIcon />
            </Title>
            <Avatar
                src="../../resources/emptyProfile.png"
                alt="it's me"
                size="xl"
            />
            <Text
                align="center"
                size="md"
                color="white"
                fw={500}
                sx={{ width: "80%", marginTop: "5%", marginBottom: "10%" }}
                onClick={() => history.push("/profile/edit/quote")}
            >
                "this is a very creative, generated quote, which shows everyone how cool userName is!" <EditIcon size={18} />
            </Text>
            <StandardButton
                component={Link}
                to="/dashboard"
            >
                Back
            </StandardButton>
        </BaseContainer>
    );*/
};

export default Edit;
