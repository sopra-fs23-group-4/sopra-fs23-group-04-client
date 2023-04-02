import Header from "components/ui/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { Background } from "./components/ui/Background";
import { MantineProvider } from "@mantine/core";

const App = () => {
    return (
        <div>
            <MantineProvider
                theme={{ colorScheme: "dark" }}
                withGlobalStyles
                withNormalizeCSS
            >
                <Background />
                <Header height="100" />
                <AppRouter />
            </MantineProvider>
        </div>
    );
};

export default App;
