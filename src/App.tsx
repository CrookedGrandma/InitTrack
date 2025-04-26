import { FluentProvider, makeStyles, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router";
import Content from "./components/Content";
import Context from "./components/context/Contexts";
import ThemeButton from "./components/ThemeButton";

const useStyles = makeStyles({
    app: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
    },
});

export default function App() {
    const darkTheme = Context.DarkTheme.useValue();

    const classes = useStyles();

    return (
        <FluentProvider id="fluent-root" theme={darkTheme.value ? webDarkTheme : webLightTheme}>
            <BrowserRouter>
                <ThemeButton />
                <div id="app" className={classes.app}>
                    <Content />
                </div>
            </BrowserRouter>
        </FluentProvider>
    );
}
