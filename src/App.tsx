import { FluentProvider, makeStyles, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import Content from "./components/Content";
import { Context } from "./components/context/ContextProvider";
import ThemeButton from "./components/ThemeButton";

const useStyles = makeStyles({
    app: {
        flexGrow: 1,
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
            <ThemeButton />
            <div id="app" className={classes.app}>
                <Content />
            </div>
        </FluentProvider>
    );
}
