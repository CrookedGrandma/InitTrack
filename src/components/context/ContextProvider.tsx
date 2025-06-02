import { createValueContext } from "../hooks/createValueContext";

type HistoryContext = {
    showing: false;
} | {
    showing: true;
    creature: CreatureReference;
    type: "incoming" | "outgoing";
};

export const Context = {
    DarkTheme: createValueContext<boolean>("DarkTheme"),
    HistoryDialog: createValueContext<HistoryContext>("ShowingHistoryDialog"),
};

export function ContextProvider({ children }: Parent) {
    return (
        // Add new context providers here
        <Context.DarkTheme.Provider defaultValue={true}>
            <Context.HistoryDialog.Provider defaultValue={{ showing: false }}>
                {children}
            </Context.HistoryDialog.Provider>
        </Context.DarkTheme.Provider>
    );
}
