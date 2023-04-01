import Header from "components/ui/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { Background } from "./components/ui/Background";
import { MantineProvider } from "@mantine/core";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
    return (
        <div>
            <MantineProvider theme={{}} withGlobalStyles withNormalizeCSS>
                <Background />
                <Header height="100" />
                <AppRouter />
            </MantineProvider>
        </div>
    );
};

export default App;
