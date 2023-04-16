import BaseContainer from "../../ui/BaseContainer";
import { Chip, Group, Title } from "@mantine/core";
import React from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";

const Categories = () => {
    const history = useHistory();

    /*    const [AllCategories, setAllCategories] = useState([]);

    //PROVISORISCH BIS BACKEND STEHT
    useEffect(() => {
        async function fetchData() {
            try {
                setAllCategories(await RestApi.getQuoteCategories());
            } catch (error) {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the categories! See the console for details.");
            }
        }
        fetchData();
    }, [user]);*/

    return (
        <BaseContainer>
            <Title color="white">Category Selection</Title>{" "}
            <Chip.Group
                multiple
                position="center"
                mt="md"
                defaultChecked
            >
                <Group>
                    <Chip
                        color="yellow"
                        value="1"
                    >
                        Multiple chips
                    </Chip>
                    <Chip
                        color="yellow"
                        value="2"
                    >
                        Can be selected
                    </Chip>
                    <Chip
                        color="yellow"
                        value="3"
                    >
                        At a time
                    </Chip>
                </Group>
            </Chip.Group>
            <StandardButton
                onClick={() => history.push("/game")}
                sx={{ marginTop: "3%" }}
            >
                Leave
            </StandardButton>
        </BaseContainer>
    );
};

export default Categories;
