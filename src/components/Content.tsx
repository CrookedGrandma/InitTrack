import { makeStyles, tokens } from "@fluentui/react-components";
import Header from "./Header";
import Player from "./Player";

const useStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "start",
        width: "800px",
        maxWidth: "calc(90% - 4rem)",
        borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
        padding: "2rem",
        flexGrow: 1,
    },
});

export default function Content() {
    const classes = useStyles();

    return <div id="content" className={classes.content}>
        <Header />
        <Player />
    </div>;
}
