import {
    Button,
    ButtonProps,
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
} from "@fluentui/react-components";
import { ReactNode, useState } from "react";
import { sortByName } from "../../util/creature_util";

type Props<T extends Action["type"]> = {
    creatures: Creature[];
    triggerLabel: string;
    triggerIcon: ButtonProps["icon"];
    dialogTitle: string;
    targetSelectLabel: string;
    additionalFields: ReactNode;
    clearAdditionalFields: () => void;
    validateAdditionalFields: () => boolean;
    createAction: (targets: CreatureReference[]) => ActionType<T>;
    processAction: (action: ActionType<T>) => void;
};

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
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
});

export default function ActionDialog<T extends Action["type"]>({
    creatures,
    triggerLabel,
    triggerIcon,
    dialogTitle,
    targetSelectLabel,
    additionalFields,
    clearAdditionalFields,
    validateAdditionalFields,
    createAction,
    processAction,
}: Readonly<Props<T>>) {
    const [selectedCreatures, setSelectedCreatures] = useState<SelectionItemId[]>([]);

    const classes = useStyles();

    function clear() {
        setSelectedCreatures([]);
        clearAdditionalFields();
    }

    function validateSubmittable() {
        return selectedCreatures.length > 0 && validateAdditionalFields();
    }

    function submit() {
        const to = creatures.filter(c => selectedCreatures.includes(c.id));
        if (to.length === 0)
            throw Error("No creatures were selected");
        const action = createAction(to);
        processAction(action);
        clear();
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button icon={triggerIcon}>{triggerLabel}</Button>
            </DialogTrigger>
            <DialogSurface className={classes.surface}>
                <DialogBody>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogContent className={classes.content}>
                        {additionalFields}
                        <Field label={targetSelectLabel}>
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
                                disabled={!validateSubmittable()}
                                onClick={submit}
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
