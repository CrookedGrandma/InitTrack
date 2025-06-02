import { createContext, useContext, useMemo, useState } from "react";

interface ValueContext<T> {
    value: T;
    setValue: (value: T) => void;
}

/**
 * Creates a context with a value of the given type and a corresponding setter function
 * @param name The name of the context (for debugging purposes)
 */
export function createValueContext<T>(name: string) {
    const Context = createContext<ValueContext<T> | undefined>(undefined);
    Context.displayName = name;

    function Provider({ children, defaultValue }: Parent & DefaultValue<T>) {
        const [value, setValue] = useState<T>(defaultValue);

        const contextValue = useMemo(() => {
            return {
                value,
                setValue,
            } as ValueContext<T>;
        }, [value]);

        return <Context.Provider value={contextValue}>{children}</Context.Provider>;
    }

    function useValue() {
        const context = useContext(Context);
        if (!context)
            throw Error(`The hook for the ${name} context must be used within its Provider.`);
        return context;
    }

    return {
        Provider,
        useValue,
    };
}
