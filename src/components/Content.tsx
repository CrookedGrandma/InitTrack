import { LargeTitle, makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
    content: {
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        width: "800px",
        maxWidth: "calc(90% - 4rem)",
        borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
        padding: "2rem 2rem 0",
        flexGrow: 1,
    },
});

export default function Content() {
    const classes = useStyles();

    return <div id="content" className={classes.content}>
        <LargeTitle>InitTrack</LargeTitle>
    </div>;
}
