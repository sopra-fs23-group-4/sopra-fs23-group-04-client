import BaseContainer from "../../../ui/BaseContainer";
import { Textarea, Title, Text, NativeSelect, Group } from "@mantine/core";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StandardButton from "../../../ui/StandardButton";
import { Context } from "../../../../context";
import { StorageManager } from "../../../../helpers/storageManager";

const Quote = () => {
    const history = useHistory();
    const context = useContext(Context);

    const user = context.user;
    const [quote, setQuote] = useState("new quote");
    const [quoteCategories, setQuoteCategories] = useState([]);
    const [category, setCategory] = useState("business");

    useEffect(() => {
        async function fetchData() {
            try {
                setQuoteCategories(await RestApi.getQuoteCategories());
            } catch (error) {
                console.error(`Something went wrong while fetching the categories: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the categories! See the console for details.");
            }
        }
        fetchData();
    }, []);

    const doGenerateQuote = async () => {
        try {
            if (!category && quoteCategories[0]) {
                setCategory(quoteCategories[0]);
            }
            setQuote(await RestApi.generateQuote(category));
        } catch (error) {
            alert(`Something went wrong during changing the quote: \n${handleError(error)}`);
        }
    };

    const doChangeQuote = async () => {
        try {
            user.quote = quote;
            user.token = StorageManager.getToken();
            await RestApi.changeUser(user);
            StorageManager.setQuote(quote);
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during changing the quote: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <Title color="white">{StorageManager.getUsername()}</Title>

            <Text
                align="center"
                color="white"
                style={{ width: "75%" }}
            >
                "{StorageManager.getQuote()}"
            </Text>

            <Textarea
                value={quote}
                onChange={(event) => setQuote(event.currentTarget.value)}
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
            <StandardButton onClick={() => doGenerateQuote()}>GENERATE </StandardButton>

            <Group sx={{ marginTop: "10%" }}>
                <StandardButton onClick={() => history.push("/dashboard")}>Back </StandardButton>
                <StandardButton onClick={() => doChangeQuote()}>SAVE </StandardButton>
            </Group>
        </BaseContainer>
    );
};

export default Quote;
