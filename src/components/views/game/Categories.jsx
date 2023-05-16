import BaseContainer from "../../ui/BaseContainer";
import { Text, Chip, Group, Loader, Stack, Title, TextInput, Paper } from "@mantine/core";
import React, { useEffect, useState } from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../helpers/RestApi";
import { StorageManager } from "../../../helpers/storageManager";
import { notifications } from "@mantine/notifications";

const Categories = () => {
    const history = useHistory();

    const maxLengthCategory = 18;
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
            if (customCategory.length > maxLengthCategory) {
                notifications.show({
                    message: "category may have no more than " + maxLengthCategory + " letters.",
                    color: "red",
                    position: "top-center",
                    autoClose: 4000,
                });
                setCustomCategory("");
            } else {
                setCustomCategories([...customCategories, customCategory.trim()]);
                setCustomCategory("");
            }
        }
    };

    const addRandomCategory = async () => {
        console.log("hello");
        try {
            const randomCategory = await RestApi.getRandomCategory();
            setCustomCategories([...customCategories, randomCategory.trim()]);
        } catch (error) {
            console.error(`Something went wrong while fetching the random category: \n${handleError(error)}`);
        }
    };

    const Category = ({ category }) => {
        return (
            <div className="player container">
                <Chip
                    color="yellow"
                    size="lg"
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
                        sx={{ marginTop: "0%" }}
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
                sx={{ marginTop: "1%", marginBottom: "1%" }}
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
            </Stack>{" "}
            <Text
                color="white"
                size="lg"
            >
                add a random category:
            </Text>
            <StandardButton onClick={addRandomCategory}>surprise me</StandardButton>
            <Paper
                sx={{ background: "inherit", minWidth: "220px", border: "2.5px solid azure", marginTop: "5%" }}
                style={{ width: "100%" }}
                radius="md"
                align="center"
                spacing="xs"
            >
                {" "}
                {contentCategory}
                {categoriesSelected.length > 10 ? (
                    <Text
                        color="red"
                        size="lg"
                        highlighted="true"
                        sx={{ marginTop: "3%" }}
                    >
                        <strong>max. 10 categories allowed </strong>
                    </Text>
                ) : null}
                <StandardButton
                    disabled={categoriesSelected.length === 0 || categoriesSelected.length > 10}
                    onClick={() => doContinue()}
                    sx={{ marginTop: "5%", marginBottom: "5%" }}
                >
                    confirm selection
                </StandardButton>
            </Paper>
            <StandardButton
                onClick={() => history.push("/game/")}
                sx={{ marginTop: "5%" }}
            >
                cancel
            </StandardButton>
        </BaseContainer>
    );
};

export default Categories;
