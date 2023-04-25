import { useHistory, useParams } from "react-router-dom";
import { Checkbox as CheckIcon } from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import BaseContainer from "../../../ui/BaseContainer";
import StandardButton from "../../../ui/StandardButton";
import { Edit as EditIcon } from "tabler-icons-react";
import { Button, Stack, Title } from "@mantine/core";
import { handleError } from "../../../../helpers/RestApi";
import { storageManager } from "../../../../helpers/storageManager";

const Board = () => {
    const history = useHistory();
    const { gamePin } = useParams();

    const [letter, setLetter] = useState(null);
    const [categories, setCategories] = useState(null);
    const [answers, setAnswers] = useState(["Appenzell", "Andorra", null, "Audi"]);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                if (isMounted) {
                    if (!letter) {
                        storageManager.setLetter("A");
                        setLetter(storageManager.getLetter());
                    }
                    if (!categories) {
                        storageManager.setCategories(["City", "Country", "FirstName", "Musical Instrument"]);
                        setCategories(storageManager.getCategories());
                    }

                    if (!answers) {
                        setAnswers(Array(4).fill(null));
                    }
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
    }, [answers, categories, letter]);

    const Category = ({ category }) => {
        let index = categories.indexOf(category);
        let iconContent = (
            <EditIcon
                strokeWidth={1.8}
                color="red"
                size={21}
            />
        );
        if (answers[index]) {
            iconContent = (
                <CheckIcon
                    color="green"
                    size={20}
                />
            );
        }

        return (
            <div
                className="player container"
                align="center"
            >
                <Button
                    variant="gradient"
                    gradient={{ from: "white", to: "white", deg: 105 }}
                    radius="xl"
                    size="lg"
                    sx={{ minWidth: "200px", color: "Black", marginBottom: "2%" }}
                    value={category}
                    onClick={() => history.push(`/game/${gamePin}/board/${index}`)}
                >
                    {category}&nbsp; {iconContent}
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
                {categories &&
                    categories.map((category) => (
                        <Category
                            key={category}
                            category={category}
                        />
                    ))}
            </Stack>
            <StandardButton
                position="center"
                sx={{ marginTop: "5%" }}
                disabled={!answers.every((value) => value !== null)}
            >
                DONE
            </StandardButton>
        </BaseContainer>
    );
};

export default Board;
