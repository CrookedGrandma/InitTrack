import { Button, Caption1, Card, CardHeader, Text } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { makeAvatar } from "../util/component_util";
import { ReactNode } from "react";

interface Props {
    action: Action;
    removeAction: (action: Action) => void;
}

function damageHeader(action: ActionType<"damage">) {
    const type = action.damageType;
    const avatar = makeAvatar(type);

    if (action.targets.length === 1) {
        return <Text>{action.amount} {avatar} {type.name} damage to {action.targets[0].name}</Text>;
    }

    return <Text>{action.amount} {avatar} {type.name} damage to</Text>;
}

function healHeader(action: ActionType<"heal">) {
    const type = action.healType;
    const avatar = makeAvatar(type);

    if (type.type === "normal") {
        return action.targets.length === 1
            ? <Text>{avatar} Healing {action.targets[0].name} for {action.amount} HP</Text>
            : <Text>{avatar} Healing for {action.amount} HP:</Text>;
    }
    if (type.type === "temp") {
        return action.targets.length === 1
            ? <Text>Giving {action.amount} {avatar} temporary HP to {action.targets[0].name}</Text>
            : <Text>Giving {action.amount} {avatar} temporary HP to</Text>;
    }
}

export default function PendingAction({ action, removeAction }: Readonly<Props>) {
    let header: ReactNode = undefined;
    let description: ReactNode = undefined;

    if (action.targets.length > 1) {
        description = (
            <ul>
                {action.targets.map(t => <Caption1 key={t.id}><li>{t.name}</li></Caption1>)}
            </ul>
        );
    }

    if (action.type === "damage")
        header = damageHeader(action);
    if (action.type === "heal")
        header = healHeader(action);

    return (
        <Card onClick={() => {}}>
            <CardHeader
                header={header}
                description={description}
                action={<Button icon={<DismissRegular />} onClick={() => removeAction(action)} />}
            />
        </Card>
    );
}
