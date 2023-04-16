import BaseContainer from "../../ui/BaseContainer";
import { Chip, Group, Title } from "@mantine/core";
import React from "react";
import StandardButton from "../../ui/StandardButton";
import { useHistory } from "react-router-dom";

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

const Categories = () => {
    const history = useHistory();
    const categories = ["city", "country", "profession"];

    return (
        <BaseContainer>
            <Title color="white">Category Selection</Title>{" "}
            <Chip.Group
                multiple
                position="center"
                mt="md"
                defaultChecked
            >
                <Group sx={{ marginTop: "5%" }}>
                    {categories.map((category) => (
                        <Category category={category} />
                    ))}
                </Group>
            </Chip.Group>
            <StandardButton
                onClick={() => history.push("/game/settings")}
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
