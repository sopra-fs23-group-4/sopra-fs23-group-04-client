import Header from "components/ui/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { Background } from "./components/ui/Background";
import { MantineProvider } from "@mantine/core";
import { ContextProvider } from "./context";
import { Notifications } from "@mantine/notifications";

const App = () => {
    return (
        <div>
            <ContextProvider>
                <Notifications position="top-center" />
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
