import { Title, Text } from "@mantine/core";
import BaseContainer from "../ui/BaseContainer";

const Rules = () => {
  return (
    <BaseContainer>
      <Title color="white" style={{ marginBottom: "1rem" }}>
        Rules
      </Title>
      <Text color="white" size="md" style={{ marginBottom: "1rem" }}>
        Welcome to <strong>Stadt Land PLUS</strong>, an engaging word game that
        challenges players to list words that fit specific categories, all
        beginning with the same letter.
      </Text>
      <Text color="white" size="md" style={{ marginBottom: "1rem" }}>
        To play Stadt Land +, follow these simple steps:
      </Text>
      <ol style={{ color: "white", marginLeft: "1.5rem" }}>
        <li>Register as a player, create a game, and invite friends to join your lobby using the unique gamepin.</li>
        <li>As the host, choose from predefined categories or create your own custom categories for the game.</li>
        <li>Set the game parameters, such as the number of rounds and the length of each round.</li>
        <li>Once all players have joined the lobby, begin the game by clicking "Start."</li>
        <li>A random letter of the alphabet will be generated for each round, and players will have a limited time to list words for each category starting with that letter.</li>
        <li>After the timer runs out, players will vote on other players' answers, classifying them as correct, correct but not unique, or incorrect.</li>
        <li>Points are awarded based on the votes: 3 points for correct and unique answers, 1 point for correct but not unique answers, and 0 points for incorrect answers.</li>
        <li>The player with the highest overall score after all rounds have been played is declared the winner.</li>
        <li>For each new round, a different letter will be selected for the categories.</li>
      </ol>
      <Text color="white" size="md" style={{ marginTop: "1rem" }}>
        Dive into the fun of <strong>Stadt Land PLUS</strong> and challenge your
        friends to a thrilling word game experience!
      </Text>
    </BaseContainer>
  );
};

export default Rules;