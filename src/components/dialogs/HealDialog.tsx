import { Field, List, ListItem, makeStyles, Persona, SelectionItemId } from "@fluentui/react-components";
import ActionDialog from "./ActionDialog";
import { healTypes } from "../../constants";
import IntField from "../IntField";
import { LuShieldPlus } from "react-icons/lu";
import { useState } from "react";

interface Props {
    activeCreature: CreatureReference;
    creatures: Creature[];
    processHeal: (heal: ActionType<"heal">) => void;
}

const useStyles = makeStyles({
    healTypeList: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
});

export default function HealDialog({ activeCreature, creatures, processHeal }: Readonly<Props>) {
    const [amount, setAmount] = useState<number | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<SelectionItemId[]>([]);

    const classes = useStyles();

    function createAction(targets: CreatureReference[]): ActionType<"heal"> {
        if (!amount)
            throw Error("Amount was not set correctly");
        const type = healTypes.find(t => selectedTypes[0] == t.type);
        if (!type)
            throw Error("Heal type was not set correctly");
        return {
            id: crypto.randomUUID(),
            type: "heal",
            source: activeCreature,
            targets: targets,
            healType: type,
            amount: amount,
        };
    }

    function clear() {
        setAmount(null);
        setSelectedTypes([]);
    }

    return (
        <ActionDialog
            creatures={creatures}
            triggerLabel="Heal"
            triggerIcon={<LuShieldPlus />}
            dialogTitle="Heal"
            targetSelectLabel="Whom?"
            additionalFields={<>
                <IntField label="How much?" value={amount} setValue={setAmount} />
                <Field label="What type?">
                    <List
                        className={classes.healTypeList}
                        selectionMode="single"
                        selectedItems={selectedTypes}
                        onSelectionChange={(_, data) => setSelectedTypes(data.selectedItems)}
                    >
                        {healTypes.map(t => (
                            <ListItem key={t.type} value={t.type}>
                                <Persona
                                    name={t.name}
                                    avatar={{ name: undefined, icon: t.icon }}
                                    textAlignment="center"
                                    size="small"
                                />
                            </ListItem>
                        ))}
                    </List>
                </Field>
            </>}
            clearAdditionalFields={clear}
            validateAdditionalFields={() => !!amount && selectedTypes.length > 0}
            createAction={createAction}
            processAction={processHeal}
        />
    );
}
