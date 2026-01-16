import { Field, List, ListItem, makeStyles, Persona, SelectionItemId } from "@fluentui/react-components";
import ActionDialog from "./ActionDialog";
import { damageTypes } from "../../constants";
import IntField from "../IntField";
import { LuSwords } from "react-icons/lu";
import { useState } from "react";

interface Props {
    activeCreature: CreatureReference;
    creatures: Creature[];
    processDamage: (damage: ActionType<"damage">) => void;
}

const useStyles = makeStyles({
    damageTypeList: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridAutoFlow: "column",
        gap: "0.25rem",
        ["&>li:nth-child(-n+3)"]: {
            gridColumn: 1,
        },
        ["&>li:nth-child(n+4)"]: {
            gridColumn: 2,
        },
    },
});

export default function DamageDialog({ activeCreature, creatures, processDamage }: Readonly<Props>) {
    const [damage, setDamage] = useState<number | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<SelectionItemId[]>([]);

    const classes = useStyles();

    function createAction(targets: CreatureReference[]): ActionType<"damage"> {
        if (!damage)
            throw new Error("Damage was not set correctly");
        const type = damageTypes.find(t => selectedTypes[0] == t.name);
        if (!type)
            throw new Error("Damage type was not set correctly");
        return {
            id: crypto.randomUUID(),
            type: "damage",
            source: activeCreature,
            targets: targets,
            damageType: type,
            amount: damage,
        };
    }

    function clear() {
        setDamage(null);
        setSelectedTypes([]);
    }

    return (
        <ActionDialog
            creatures={creatures}
            triggerLabel="Damage"
            triggerIcon={<LuSwords />}
            dialogTitle="Do damage"
            targetSelectLabel="To whom?"
            additionalFields={<>
                <IntField label="How much?" value={damage} setValue={setDamage} />
                <Field label="What type?">
                    <List
                        className={classes.damageTypeList}
                        selectionMode="single"
                        selectedItems={selectedTypes}
                        onSelectionChange={(_, data) => setSelectedTypes(data.selectedItems)}
                    >
                        {damageTypes.map(t => (
                            <ListItem key={t.name} value={t.name}>
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
            validateAdditionalFields={() => !!damage && selectedTypes.length > 0}
            createAction={createAction}
            processAction={processDamage}
        />
    );
}
