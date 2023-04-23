import { createContext, useContext, useState } from "react";

export const Context = createContext("Default Value");

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [categoriesSelected, setCategoriesSelected] = useState(null);
    const [answers, setAnswers] = useState(null);

    const content = {
        user,
        setUser,
        categoriesSelected,
        setCategoriesSelected,
        answers,
        setAnswers,
    };

    return (
        <Context.Provider value={content}>
            <ContextGuard children={children} />
        </Context.Provider>
    );
};

const ContextGuard = ({ children }) => {
    const context = useContext(Context);
    if (!context) return null;
    return <>{children}</>;
};
