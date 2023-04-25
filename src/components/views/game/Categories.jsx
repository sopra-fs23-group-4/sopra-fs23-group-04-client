import BaseContainer from "../../ui/BaseContainer";
import { Chip, Group, Loader, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { storageManager } from "../../../helpers/storageManager";

const Categories = () => {
    const history = useHistory();

    const [categories, setCategories] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                const response = await RestApi.getAllCategories();
                if (isMounted) {
                    setCategories(response);
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the categories! See the console for details.");
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const doContinue = () => {
        history.push("/game/settings");
        storageManager.setCategoriesSelected(categoriesSelected);
    };

    const Category = ({ category }) => {
        return (
            <div className="player container">
                <Chip
                    color="yellow"
                    size="xl"
                    value={category}
                >
                    {category}
                </Chip>
            </div>
        );
    };

    let contentCategory = <Loader />;
    if (categories.length !== 0) {
        contentCategory = (
            <Chip.Group
                multiple
                position="center"
                mt="md"
                defaultChecked
                onChange={setCategoriesSelected}
            >
                <Group
                    sx={{ marginTop: "5%" }}
                    position="center"
                >
                    {categories.map((category) => (
                        <Category
                            key={category}
                            category={category}
                        />
                    ))}
                </Group>
            </Chip.Group>
        );
    }

    return (
        <BaseContainer align="center">
            <Title color="white">Category Selection</Title> {contentCategory}
            <StandardButton
                onClick={() => doContinue()}
                sx={{ marginTop: "5%" }}
            >
                Done
            </StandardButton>
            <StandardButton
                onClick={() => history.push("/game/")}
                sx={{ marginTop: "5%" }}
            >
                Leave
            </StandardButton>
        </BaseContainer>
    );
};

export default Categories;
