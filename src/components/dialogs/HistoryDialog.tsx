import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { Context } from "../context/ContextProvider";
import { distinctBy } from "../../util/object_util";
import { makeAvatar } from "../../util/component_util";
import { ReactNode } from "react";

interface Props {
    historyItems: HistoryItem[];
}

function actionToStringOutgoing(a: Action): ReactNode {
    if (a.type === "damage")
        return <>Did {a.amount} {makeAvatar(a.damageType)} {a.damageType.name} damage to {a.targets.map(t => t.name).join(", ")}</>;
    if (a.type === "heal") {
        const avatar = makeAvatar(a.healType);
        if (a.healType.type === "normal")
            return <>{avatar} Healed {a.targets.map(t => t.name).join(", ")} for {a.amount} HP</>;
        return <>Gave {a.targets.map(t => t.name).join(", ")} {a.amount} {avatar} temporary HP</>;
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

export default function HistoryDialog({ historyItems }: Readonly<Props>) {
    const historyContext = Context.HistoryDialog.useValue();
    const value = historyContext.value;

    let title: string = "", content: ReactNode = undefined;
    if (value.showing) {
        title = `${value.creature.name}'s ${value.type} history`;

        let listItems;
        if (value.type === "outgoing") {
            const filtered = historyItems.filter(i => i.actions.some(a => a.source.id === value.creature.id));
            const actions = distinctBy(filtered.flatMap(i => i.actions), "id");
            listItems = actions.map<[Guid, ReactNode]>(a => [a.id, actionToStringOutgoing(a)])
                .map(a => <li key={a[0]}>{a[1]}</li>);
        }
        else {
            const filtered = historyItems.filter(i => i.effect.target.id === value.creature.id);
            listItems = filtered.flatMap(i => i.actions)
                .map<[Guid, ReactNode]>(a => [a.id, actionToStringIncoming(a)])
                .map(a => <li key={a[0]}>{a[1]}</li>);
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
