import BaseContainer from "../../../ui/BaseContainer";
import React, { useEffect, useState } from "react";
import { Title } from "@mantine/core";
import { useHistory, useParams } from "react-router-dom";
import { storageManager } from "../../../../helpers/storageManager";
import { handleError } from "../../../../helpers/RestApi";
import StandardButton from "../../../ui/StandardButton";

const Letter = () => {
    const history = useHistory();
    const { gamePin, round } = useParams();

    const [letter, setLetter] = useState(null);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            try {
                if (isMounted) {
                    if (!letter) {
                        setLetter("A");
                    }
                    if (!categories) {
                        setCategories(["City", "Country", "FirstName", "Musical Instrument"]);
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
    }, []);

    const doStart = () => {
        storageManager.resetRound();
        storageManager.setAnswers(Array(categories.length).fill(null));
        storageManager.setLetter(letter);
        storageManager.setCategories(categories);
        history.push(`/game/${gamePin}/round/${round}/board/`);
    };

    return (
        <BaseContainer>
            <Title color="white">next letter:</Title>
            <Title
                color="white"
                size="150"
            >
                {"A"}
            </Title>
            <StandardButton onClick={() => doStart()}> Start </StandardButton>
        </BaseContainer>
    );
};

export default Letter;
