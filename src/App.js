import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
import { Background } from "./components/ui/Background";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
    return (
        <div>
            <Background />
            <Header height="100" />
            <AppRouter />
        </div>
    );
};

export default App;
