import BaseContainer from "../../ui/BaseContainer";
import { Text, Chip, Group, Loader, Stack, Title, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { StorageManager } from "../../../helpers/storageManager";

const Categories = () => {
    const history = useHistory();

    const [categories, setCategories] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [customCategory, setCustomCategory] = useState("");
    const [customCategories, setCustomCategories] = useState([]);

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
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    const doContinue = () => {
        history.push("/game/settings");
        StorageManager.setCategoriesSelected(categoriesSelected);
    };
    const addCustomCategory = () => {
        if (customCategory.trim() !== "") {
            setCustomCategories([...customCategories, customCategory.trim()]);
            setCustomCategory("");
        }
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
            <Stack
                align="center"
                sx={{ marginTop: "3%" }}
            >
                <Text
                    color="white"
                    size="lg"
                >
                    click on categories to select:
                </Text>
                <Chip.Group
                    multiple
                    mt="md"
                    onChange={setCategoriesSelected}
                >
                    <Group position="center">
                        {categories.map((category) => (
                            <Category
                                key={category}
                                category={category}
                            />
                        ))}
                    </Group>
                    <Group
                        sx={{ marginTop: "1%" }}
                        position="center"
                    >
                        {customCategories.map((category) => (
                            <Category
                                key={category}
                                category={category}
                            />
                        ))}
                    </Group>
                </Chip.Group>
            </Stack>
        );
    }

    return (
        <BaseContainer align="center">
            <Title color="white">Category Selection</Title>
            <Stack
                align="center"
                sx={{ marginTop: "3%" }}
            >
                <Text
                    color="white"
                    size="lg"
                >
                    add your own category:
                </Text>
                <Group>
                    <TextInput
                        placeholder="be creative"
                        radius="lg"
                        value={customCategory}
                        size="md"
                        sx={{ "& .mantine-TextInput-label": { color: "white" } }}
                        onChange={(event) => setCustomCategory(event.currentTarget.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                addCustomCategory();
                            }
                        }}
                    />
                    <StandardButton onClick={addCustomCategory}>add</StandardButton>
                </Group>
            </Stack>

            {contentCategory}

            <StandardButton
                disabled={categoriesSelected.length === 0}
                onClick={() => doContinue()}
                sx={{ marginTop: "3%" }}
            >
                Confirm Selection
            </StandardButton>
            <StandardButton
                onClick={() => history.push("/game/")}
                sx={{ marginTop: "10%" }}
            >
                Cancel
            </StandardButton>
        </BaseContainer>
    );
};

export default Categories;
