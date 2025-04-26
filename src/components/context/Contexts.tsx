import { createValueContext } from "./createValueContext";

const Context = {
    DarkTheme: createValueContext<boolean>("DarkTheme"),
};

export default Context;
