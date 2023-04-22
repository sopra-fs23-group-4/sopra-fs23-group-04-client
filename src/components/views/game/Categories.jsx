import BaseContainer from "../../ui/BaseContainer";
import { Chip, Group, Title } from "@mantine/core";
import React, { useState } from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";

const Categories = () => {
    const history = useHistory();
    const categories = ["city", "country", "profession"];
    const [categoriesSelected, setCategoriesSelected] = useState([]);

    const doContinue = () => {
        history.push("/game/settings");
        sessionStorage.setItem("categories", JSON.stringify(categoriesSelected));
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

    return (
        <BaseContainer>
            <Title color="white">Category Selection</Title>{" "}
            <Chip.Group
                multiple
                position="center"
                mt="md"
                defaultChecked
                onChange={setCategoriesSelected}
            >
                <Group sx={{ marginTop: "5%" }}>
                    {categories.map((category) => (
                        <Category
                            key={category}
                            category={category}
                        />
                    ))}
                </Group>
            </Chip.Group>
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
