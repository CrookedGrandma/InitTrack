import { createContext, useContext, useMemo } from "react";
import { useLSState } from "./useLSState";

interface ValueContext<T> {
    value: T;
    setValue: (value: T) => void;
}

/**
 * Creates a context with a value of the given type and a corresponding setter function
 * @param name The name of the context (for debugging & local storage purposes)
 */
export function createValueContext<T>(name: string) {
    const Context = createContext<ValueContext<T> | undefined>(undefined);
    Context.displayName = name;

    function Provider({ children, defaultValue }: Parent & DefaultValue<T>) {
        const [value, setValue] = useLSState<T>(name, defaultValue);

        const contextValue = useMemo(() => {
            return {
                value,
                setValue,
            } as ValueContext<T>;
        }, [value, setValue]);

        return <Context.Provider value={contextValue}>{children}</Context.Provider>;
    }

    function useValue() {
        const context = useContext(Context);
        if (!context)
            throw new Error(`The hook for the ${name} context must be used within its Provider.`);
        return context;
    }

    return {
        Provider,
        useValue,
    };
}
