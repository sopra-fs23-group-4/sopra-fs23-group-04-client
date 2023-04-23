import BaseContainer from "../../../ui/BaseContainer";
import { Title, Text } from "@mantine/core";

const Lobby = (props) => {
    const gamePin = props.match.params["gamePin"];

    return (
        <BaseContainer>
            <Title color="white">Lobby</Title>
            <Text>The value is:{gamePin}</Text>
        </BaseContainer>
    );
};

export default Lobby;
