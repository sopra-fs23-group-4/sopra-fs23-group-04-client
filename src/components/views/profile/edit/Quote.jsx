import BaseContainer from "../../../ui/BaseContainer";
import { Textarea, Title, Text, Loader, NativeSelect } from "@mantine/core";
import { handleError, RestApi } from "../../../../helpers/RestApi";
import User from "../../../../models/User";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StandardButton from "../../../ui/StandardButton";

const Quote = () => {
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [quote, setQuote] = useState("new quote");
    const [quoteCategories, setQuoteCategories] = useState([]);
    const [category, setCategory] = useState("business");

    useEffect(() => {
        async function fetchData() {
            try {
                const responseUserId = await RestApi.getUser();
                setUser(new User(responseUserId.data));
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
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
            user.token = sessionStorage.getItem("token");
            await RestApi.changeUser(user);
            history.push(`/dashboard`);
        } catch (error) {
            alert(`Something went wrong during changing the quote: \n${handleError(error)}`);
        }
    };

    let contentUserName = <Loader />;
    let contentQuote = <Loader />;
    if (user) {
        contentUserName = user.username;
        contentQuote = user.quote;
    }

    return (
        <BaseContainer>
            <Title color="white">{contentUserName}</Title>

            <Text
                align="center"
                color="white"
                style={{ width: "75%" }}
            >
                "{contentQuote}"
            </Text>

            <Textarea
                value={quote}
                onChange={(event) => setQuote(event.currentTarget.value)}
                autosize
                minRows={2}
                style={{ width: "80%" }}
            />
            <StandardButton
                onClick={() => doChangeQuote()}
                sx={{ marginTop: "0px" }}
            >
                SAVE{" "}
            </StandardButton>

            <NativeSelect
                data={quoteCategories}
                description="select a category"
                onChange={(event) => setCategory(event.currentTarget.value)}
            />
            <StandardButton
                onClick={() => doGenerateQuote()}
                sx={{ marginTop: "0px" }}
            >
                GENERATE{" "}
            </StandardButton>

            <StandardButton
                onClick={() => history.push("/dashboard")}
                sx={{ marginTop: "3%" }}
            >
                Back{" "}
            </StandardButton>
        </BaseContainer>
    );
};

export default Quote;
