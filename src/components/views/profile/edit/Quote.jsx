import BaseContainer from "../../../ui/BaseContainer";
import { Textarea, Title, Text, NativeSelect, Group } from "@mantine/core";
import { handleError, RestApi } from "../../../../api/RestApi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StandardButton from "../../../ui/StandardButton";
import { StorageManager } from "../../../../helpers/storageManager";
import TopTitle from "../../../ui/TopTitle";

const Quote = () => {
    const history = useHistory();

    const [errorLength, setErrorLength] = useState(null);
    const [quote, setQuote] = useState("new quote");
    const [quoteCategories, setQuoteCategories] = useState([]);
    const [category, setCategory] = useState("business");

    useEffect(() => {
        RestApi.getQuoteCategories()
            .then((response) => {
                setQuoteCategories(response);
            })
            .catch((error) => {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
            });
    }, []);

    const doGenerateQuote = async () => {
        try {
            if (!category && quoteCategories[0]) {
                setCategory(quoteCategories[0]);
            }
            setQuote(await RestApi.generateQuote(category));
        } catch (error) {
            console.error(`Something went wrong during changing the quote: \n${handleError(error)}`);
        }
    };
    const handleQuoteChange = (event) => {
        const value = event.currentTarget.value;

        setQuote(value);
    };

    useEffect(() => {
        if (quote.length > 255) {
            setErrorLength("your quote is too long, sometimes less is more...");
        } else {
            setErrorLength(null);
        }
    }, [quote]);

    const doChangeQuote = async () => {
        try {
            await RestApi.changeQuote(quote);
            StorageManager.setQuote(quote);
            history.push(`/dashboard`);
        } catch (error) {
            console.error(`Something went wrong during changing the quote: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <TopTitle>winning quote</TopTitle>
            <Title color="white">{StorageManager.getUsername()}</Title>

            <Text
                align="center"
                color="white"
                style={{ width: "75%" }}
            >
                {StorageManager.getQuote()}
            </Text>

            <Textarea
                error={errorLength}
                styles={{ error: { color: "white" } }}
                value={quote}
                onChange={handleQuoteChange}
                autosize
                minRows={2}
                style={{ width: "80%", marginTop: "2%" }}
            />

            <NativeSelect
                data={quoteCategories}
                sx={{ "& .mantine-NativeSelect-description": { color: "azure" } }}
                description="select a category to generate"
                onChange={(event) => setCategory(event.currentTarget.value)}
            />
            <StandardButton onClick={() => doGenerateQuote()}>generate </StandardButton>

            <Group sx={{ marginTop: "10%" }}>
                <StandardButton onClick={() => history.push("/dashboard")}>back </StandardButton>
                <StandardButton onClick={() => doChangeQuote()}>save </StandardButton>
            </Group>
        </BaseContainer>
    );
};

export default Quote;
