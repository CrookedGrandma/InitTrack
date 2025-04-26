import { LargeTitle, makeStyles, Tab, TabList, tokens } from "@fluentui/react-components";
import { NavLink, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Paths from "./pages/paths";

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
    link: {
        textDecorationColor: tokens.colorBrandBackground2Hover,
        ["&.active"]: {
            textDecoration: "none",
        },
    },
});

function NavTab({ label, to }: Readonly<{ to: string; label: string }>) {
    const classes = useStyles();
    return <NavLink to={to} className={classes.link}><Tab value={to}>{label}</Tab></NavLink>;
}

export default function Header() {
    const classes = useStyles();

    const location = useLocation();

    const [selectedTab, setSelectedTab] = useState<string>(Paths.Home);

    useEffect(() => {
        setSelectedTab(location.pathname);
    }, [location]);

    return (
        <div id="header" className={classes.header}>
            <LargeTitle className={classes.title}>InitTrack</LargeTitle>
            <TabList selectedValue={selectedTab} appearance="subtle">
                <NavTab to={Paths.Home} label="Home" />
                <NavTab to={Paths.Builder} label="Builder" />
                <NavTab to={Paths.Player} label="Player" />
            </TabList>
        </div>
    );
}
