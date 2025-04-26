import { makeStyles, tokens } from "@fluentui/react-components";
import { Route, Routes } from "react-router";
import Builder from "./pages/Builder";
import Header from "./Header";
import Home from "./pages/Home";
import Paths from "./pages/paths";
import Player from "./pages/Player";

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
        <Header />
        <Routes>
            <Route index element={<Home />} />
            <Route path={Paths.Builder} element={<Builder />} />
            <Route path={Paths.Player} element={<Player />} />
        </Routes>
    </div>;
}
