import { useHistory } from "react-router-dom";
import { Button, Stack, Title } from "@mantine/core";
import React, { useState } from "react";
import BaseContainer from "../../../ui/BaseContainer";
import StandardButton from "../../../ui/StandardButton";

const Board = () => {
    const history = useHistory();

    const [letter, setLetter] = useState("A");
    const [categories, setCategories] = useState(["City", "Country", "FirstName", "CarBrand"]);

    const element = "Country";
    const index = categories.indexOf(element);

    console.log(`The index of "${element}" is ${index}.`);

    const Category = ({ category }) => {
        return (
            <div className="player container">
                <Button
                    variant="gradient"
                    gradient={{ from: "white", to: "white", deg: 105 }}
                    radius="xl"
                    size="lg"
                    sx={{ width: "200px", color: "Black", marginBottom: "2%" }}
                    value={category}
                >
                    {category}
                </Button>
            </div>
        );
    };

    return (
        <BaseContainer>
            <Title
                sx={{ marginTop: "2%" }}
                color="white"
                size="80"
            >
                {letter}
            </Title>
            <Stack
                position="center"
                sx={{ marginTop: "2%" }}
            >
                {categories.map((category) => (
                    <Category
                        key={category}
                        category={category}
                    />
                ))}
            </Stack>
            <StandardButton
                position="center"
                sx={{ marginTop: "5%" }}
                disabled={true}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Board;
