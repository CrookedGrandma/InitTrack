import { LargeTitle, makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    title: {
        marginBlockEnd: "1rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
});

export default function Header() {
    const classes = useStyles();

    return (
        <div id="header" className={classes.header}>
            <LargeTitle className={classes.title}>InitTrack</LargeTitle>
        </div>
    );
}
