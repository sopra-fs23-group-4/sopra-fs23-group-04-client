import { Text, Box } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";
import TopTitle from "../ui/TopTitle";
import PaperBox from "../ui/PaperBox";

const Rules = () => {
    const history = useHistory();

    return (
        <BaseContainer>
            <TopTitle style={{ marginBottom: "2%" }}>game rules</TopTitle>
            <PaperBox py="xs">
                <Text
                    color="white"
                    size="md"
                    style={{ marginTop: "1%", marginLeft: "2%", marginRight: "2%" }}
                >
                    Welcome to <strong>Stadt Land PLUS</strong>, a word game where players list words fitting certain categories, all starting with the same
                    letter.
                </Text>
                <Box align="left">
                    <ol style={{ color: "white", marginTop: "3%", marginLeft: "2%", marginRight: "2%" }}>
                        <li>A letter from the alphabet is randomly selected each round.</li>
                        <li>For each category, players have to find a word that begins with the round's letter.</li>
                        <li>
                            The first player that has answered all categories can end the round for all players. The round ends automatically when the timer is
                            up.
                        </li>
                        <li>Points are awarded: 3 points for correct answers, 1 point for duplicate answers, and 0 points for wrong/no answers.</li>
                        <li>The player with the highest total score wins.</li>
                    </ol>
                </Box>
                <Text
                    color="white"
                    size="md"
                    style={{ marginTop: "2%", marginBottom: "2%" }}
                >
                    Enjoy the thrill of <strong>Stadt Land PLUS</strong>!
                </Text>
            </PaperBox>
            <StandardButton
                onClick={() => history.push("/dashboard")}
                sx={{ marginTop: "3%", marginBottom: "5%" }}
            >
                back{" "}
            </StandardButton>
        </BaseContainer>
    );
};

export default Rules;
