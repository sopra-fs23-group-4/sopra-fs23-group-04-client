import BaseContainer from "../../../ui/BaseContainer";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "@mantine/core";

const Answer = () => {
    const history = useHistory();
    const { gameId, answerIndex } = useParams();

    const [letter, setLetter] = useState("A");
    const [categories, setCategories] = useState(["City", "Country", "FirstName", "Musical Instrument"]);
    const [answers, setAnswers] = useState(["Appenzell", "Andorra", null, "Audi"]);

    return (
        <BaseContainer>
            <Title color="white">{answerIndex}</Title>
        </BaseContainer>
    );
};

export default Answer;
