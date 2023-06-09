import BaseContainer from "../../ui/BaseContainer";
import { Text, Chip, Group, Loader, Stack, TextInput } from "@mantine/core";
import React, { useEffect, useState } from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";
import { handleError, RestApi } from "../../../api/RestApi";
import { StorageManager } from "../../../helpers/storageManager";
import { notifications } from "@mantine/notifications";
import TopTitle from "../../ui/TopTitle";
import PaperBox from "../../ui/PaperBox";

const CategoryComponent = ({ category }) => {
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

const Categories = () => {
    const history = useHistory();

    const maxLengthCategory = 18;
    const [categories, setCategories] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const [customCategory, setCustomCategory] = useState("");
    const [customCategories, setCustomCategories] = useState([]);

    useEffect(() => {
        let isMounted = true;

        RestApi.getAllCategories()
            .then((response) => {
                if (isMounted) {
                    setCategories(response);
                }
            })
            .catch((error) => {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const doContinue = () => {
        history.replace("/game/settings");
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
                if (!customCategories.includes(customCategory.trim())) {
                    setCustomCategories([...customCategories, customCategory.trim()]);
                    setCustomCategory("");
                }
                setCustomCategory("");
            }
        }
    };

    const addRandomCategory = async () => {
        if (customCategories.length > 30) {
            notifications.show({
                message: "that should be enough.",
                color: "red",
                position: "top-center",
                autoClose: 4000,
            });
        } else {
            try {
                const randomCategory = await RestApi.getRandomCategory();
                if (!customCategories.includes(randomCategory["categoryName"])) {
                    setCustomCategories([...customCategories, randomCategory["categoryName"]]);
                } else {
                    await addRandomCategory();
                }
            } catch (error) {
                console.error(`Something went wrong while fetching the random category: \n${handleError(error)}`);
            }
        }
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
                            <CategoryComponent
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
                            <CategoryComponent
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
            <TopTitle>category selection</TopTitle>
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
            <StandardButton onClick={addRandomCategory}>get random</StandardButton>
            <PaperBox
                px="xl"
                py="xs"
                style={{ marginTop: "2%" }}
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
            </PaperBox>
            <StandardButton
                onClick={() => history.replace("/game/")}
                sx={{ marginTop: "5%", marginBottom: "5%" }}
            >
                cancel
            </StandardButton>
        </BaseContainer>
    );
};

export default Categories;
