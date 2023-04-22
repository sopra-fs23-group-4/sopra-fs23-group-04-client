import { createContext, useContext, useState } from "react";

export const Context = createContext("Default Value");

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [categoriesSelected, setCategoriesSelected] = useState(null);

    const content = {
        setUser,
        user,
        setCategoriesSelected,
        categoriesSelected,
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
