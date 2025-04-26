import { Button, makeStyles } from "@fluentui/react-components";
import Context from "./context/Contexts";
import { DarkThemeFilled } from "@fluentui/react-icons";

const useStyles = makeStyles({
    button: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
    },
});

export default function ThemeButton() {
    const darkTheme = Context.DarkTheme.useValue();

    const classes = useStyles();

    function onToggle() {
        darkTheme.setValue(!darkTheme.value);
    }

    return <Button onClick={onToggle} icon={<DarkThemeFilled />} size="large" className={classes.button} />;
}
