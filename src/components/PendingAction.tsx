import { Avatar, Button, Caption1, Card, CardHeader, Text } from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";
import { ReactNode } from "react";

interface Props {
    action: Action;
    removeAction: (action: Action) => void;
}

export default function PendingAction({ action, removeAction }: Readonly<Props>) {
    let header: ReactNode = undefined;
    let description: ReactNode = undefined;

    if (action.type === "damage") {
        const type = action.damageType;
        const avatar = <Avatar icon={type.icon} size={24} />;

        if (action.targets.length === 1) {
            header = <Text>{action.amount} {avatar} {type.name} damage to {action.targets[0].name}</Text>;
        }
        else {
            header = <Text>{action.amount} {avatar} {type.name} damage to</Text>;
            description = (
                <ul>
                    {action.targets.map(t => <Caption1 key={t.id}><li>{t.name}</li></Caption1>)}
                </ul>
            );
        }
    }

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
