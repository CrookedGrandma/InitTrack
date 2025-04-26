import Context from "./Contexts";

export function ContextProvider({ children }: Parent) {
    return (
        // Add new context providers here
        <Context.DarkTheme.Provider defaultValue={true}>
            {children}
        </Context.DarkTheme.Provider>
    );
}
