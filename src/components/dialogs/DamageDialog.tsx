import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Field,
    List,
    ListItem,
    makeStyles,
    Persona,
    SelectionItemId,
    SpinButton,
    SpinButtonOnChangeData,
} from "@fluentui/react-components";
import { getSpinButtonValue, sortByName } from "../../util";
import { damageTypes } from "../../constants";
import { LuSwords } from "react-icons/lu";
import { useState } from "react";

interface Props {
    activeCreature: CreatureReference;
    creatures: Creature[];
    processDamage: (damage: DamageAction) => void;
}

const useStyles = makeStyles({
    surface: {
        width: "400px",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    creatureList: {
        ["&>li:not(:first-child):not(:last-child)"]: {
            margin: "0.5rem 0",
        },
    },
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
    const [selectedCreatures, setSelectedCreatures] = useState<SelectionItemId[]>([]);

    const classes = useStyles();

    function returnData() {
        if (!damage)
            throw Error("Damage was not set correctly");
        const type = damageTypes.find(t => selectedTypes[0] == t.name);
        if (!type)
            throw Error("Damage type was not set correctly");
        const to = creatures.filter(c => selectedCreatures.includes(c.id));
        if (to.length === 0)
            throw Error("No creatures were selected");
        const effect: DamageAction = {
            id: crypto.randomUUID(),
            type: "damage",
            source: activeCreature,
            targets: to,
            damageType: type,
            amount: damage,
        };
        processDamage(effect);
        clear();
    }

    function clear() {
        setDamage(null);
        setSelectedTypes([]);
        setSelectedCreatures([]);
    }

    function getInt(data: SpinButtonOnChangeData, fallback: number): number {
        const value = getSpinButtonValue(data);
        const int = value != null ? Math.floor(value) : fallback;
        console.log("Parsed damage:", int);
        return int;
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button icon={<LuSwords />}>Damage</Button>
            </DialogTrigger>
            <DialogSurface className={classes.surface}>
                <DialogBody>
                    <DialogTitle>Do damage</DialogTitle>
                    <DialogContent className={classes.content}>
                        <Field label="How much?">
                            <SpinButton
                                value={damage}
                                onChange={(_, data) => setDamage(getInt(data, 1))}
                                min={1}
                                step={1}
                            />
                        </Field>
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
                        <Field label="To whom?">
                            <List
                                className={classes.creatureList}
                                selectionMode="multiselect"
                                selectedItems={selectedCreatures}
                                onSelectionChange={(_, data) => setSelectedCreatures(data.selectedItems)}
                            >
                                {sortByName(creatures).map(c => (
                                    <ListItem key={c.id} value={c.id}>
                                        <Persona
                                            name={c.name}
                                            avatar={{ color: "colorful" }}
                                            textAlignment="center"
                                            size="small"
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Field>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger>
                            <Button
                                disabled={!damage || selectedTypes.length === 0 || selectedCreatures.length === 0}
                                onClick={returnData}
                                appearance="primary"
                            >Apply</Button>
                        </DialogTrigger>
                        <DialogTrigger>
                            <Button onClick={clear} appearance="secondary">Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
