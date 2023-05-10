import { Title, Text } from "@mantine/core";
import StandardButton from "../ui/StandardButton";
import BaseContainer from "../ui/BaseContainer";
import { useHistory } from "react-router-dom";


const Rules = () => {

  const history = useHistory();

  return (
    <BaseContainer>
      <Title color="white" style={{ marginBottom: "1rem" }}>
        Game Rules
      </Title>
      <Text color="white" size="md" style={{ marginBottom: "1rem" }}>
        Welcome to <strong>Stadt Land PLUS</strong>, a word game where players
        list words fitting certain categories, all starting with the same letter.
      </Text>
      <ol style={{ color: "white", marginLeft: "1.5rem" }}>
        <li>A letter from the alphabet is randomly selected each round.</li>
        <li>Players have a set time limit to write words for each category that begin with the round's letter.</li>
        <li>Once the time is up, players vote on other players' answers: correct, correct but not unique, or incorrect.</li>
        <li>Points are awarded based on the votes: 3 points for correct and unique answers, 1 point for correct but not unique answers, and 0 points for incorrect answers.</li>
        <li>The player with the highest total score at the end of all rounds is the winner.</li>
        <li>In each new round, a different letter is selected for the categories.</li>
      </ol>
      <Text color="white" size="md" style={{ marginTop: "1rem" }}>
        Enjoy the thrill of <strong>Stadt Land PLUS</strong>!
      </Text>
      <StandardButton
        onClick={() => history.push("/dashboard")}
        sx={{ marginTop: "3%" }}
      >
        Back{" "}
      </StandardButton>
    </BaseContainer>
  );
};

export default Rules;