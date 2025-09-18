import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    makeStyles,
} from "@fluentui/react-components";
import { Context } from "../context/ContextProvider";
import { distinctBy } from "../../util/object_util";
import { joinCommaAnd } from "../../util/string_util";
import { makeAvatar } from "../../util/component_util";
import { ReactNode } from "react";

interface Props {
    history: HistoryItem[][];
    historyIndex: number;
}

const useStyles = makeStyles({
    inactive: {
        color: "gray",
    },
});

function actionToStringOutgoing(a: Action): ReactNode {
    const targets = joinCommaAnd(a.targets.map(t => t.name));
    if (a.type === "damage")
        return <>Did {a.amount} {makeAvatar(a.damageType)} {a.damageType.name} damage to {targets}</>;
    if (a.type === "heal") {
        const avatar = makeAvatar(a.healType);
        if (a.healType.type === "normal")
            return <>{avatar} Healed {targets} for {a.amount} HP</>;
        return <>Gave {targets} {a.amount} {avatar} temporary HP</>;
    }
    throw Error("unsupported action type");
}

function actionToStringIncoming(a: Action): ReactNode {
    if (a.type === "damage")
        return <>Took {a.amount} {makeAvatar(a.damageType)} {a.damageType.name} damage from {a.source.name}</>;
    if (a.type === "heal") {
        const avatar = makeAvatar(a.healType);
        if (a.healType.type === "normal")
            return <>{avatar} Healed for {a.amount} HP by {a.source.name}</>;
        return <>{a.amount} {avatar} temporary HP given by {a.source.name}</>;
    }
    throw Error("unsupported action type");
}

type FlatAction = Pick<HistoryItem, "round" | "initiative"> & Action;

function generateListItems(
    historyItems: HistoryItem[],
    actionToString: (action: FlatAction) => ReactNode,
    classes: string,
): ReactNode[] {
    const flatActions = historyItems.flatMap(i =>
        i.actions.map<FlatAction>(a => ({
            ...a,
            round: i.round,
            initiative: i.initiative,
        })),
    );

    return distinctBy(flatActions, "id")
        .map(a => (
            <li key={a.id} className={classes}>Round {a.round} (i{a.initiative}): {actionToString(a)}</li>
        ));
}

export default function HistoryDialog({ history, historyIndex }: Readonly<Props>) {
    const classes = useStyles();

    const historyContext = Context.HistoryDialog.useValue();
    const value = historyContext.value;

    let title: string = "", content: ReactNode = undefined;
    if (value.showing) {
        title = `${value.creature.name}'s ${value.type} history`;

        let listItems;
        if (value.type === "outgoing") {
            listItems = history.map((turnHistory, i) => generateListItems(
                turnHistory.filter(i => i.actions.some(a => a.source.id === value.creature.id)),
                actionToStringOutgoing,
                i >= historyIndex ? classes.inactive : "",
            )).flat();
        }
        else {
            listItems = history.map((turnHistory, i) => generateListItems(
                turnHistory.filter(i => i.effect.target.id === value.creature.id),
                actionToStringIncoming,
                i >= historyIndex ? classes.inactive : "",
            )).flat();
        }
        content = listItems.length > 0 ? <ul>{listItems}</ul> : "No history yet";
    }

    return (
        <Dialog open={historyContext.value.showing}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{content}</DialogContent>
                    <DialogActions>
                        <DialogTrigger>
                            <Button
                                appearance="secondary"
                                onClick={() => historyContext.setValue({ showing: false })}
                            >Close</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
