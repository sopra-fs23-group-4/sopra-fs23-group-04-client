import Header from "components/ui/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { Background } from "./components/ui/Background";
import { MantineProvider } from "@mantine/core";
import { ContextProvider } from "./context";

const App = () => {
    return (
        <div>
            <ContextProvider>
                <MantineProvider
                    theme={{
                        colorScheme: "light",
                    }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <Background />
                    <Header height="100" />
                    <AppRouter />
                </MantineProvider>
            </ContextProvider>
        </div>
    );
};

export default App;
