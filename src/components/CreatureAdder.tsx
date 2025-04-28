import {
    Button,
    Divider,
    Field,
    Input,
    InputProps,
    makeStyles,
    SpinButton,
    SpinButtonProps,
    tokens,
} from "@fluentui/react-components";
import { createSetterInput, createSetterSpinButton, emptyCreature, isValidCreature } from "../util";
import { AddSquareRegular } from "@fluentui/react-icons";
import { useState } from "react";

interface Props {
    addCreature: (creature: Creature) => void;
}

const useStyles = makeStyles({
    row: {
        width: "100%",
    },
    divider: {
        minHeight: "1rem",
    },
    fieldsContainer: {
        display: "flex",
        width: "calc(100% - 1rem)",
        gap: "0.5rem",
        padding: "0 0.5rem",
    },
    field: {
        height: "fit-content",
    },
    inputInitAc: {
        width: "3rem",
    },
    inputHp: {
        width: "5rem",
    },
    fieldHpContainer: {
        display: "flex",
    },
    fieldHpSeparator: {
        lineHeight: "32px",
    },
    input: {
        width: `calc(100% - ${tokens.spacingHorizontalMNudge})`,
    },
});

export default function CreatureAdder({ addCreature }: Readonly<Props>) {
    const classes = useStyles();

    const [creature, setCreature] = useState<OptionalNull<Creature>>(emptyCreature());

    const [hasClicked, setHasClicked] = useState<boolean>(false);

    function onClickAdd() {
        if (isValidCreature(creature)) {
            addCreature(creature);
            setCreature(emptyCreature());
            setHasClicked(false);
        }
        else {
            setHasClicked(true);
        }
    }

    function requiredIfEmpty<T>(value: T | null) {
        return hasClicked && value == null ? "required" : undefined;
    }

    function setterInput(property: keyof Creature): InputProps["onChange"] {
        return createSetterInput([creature, setCreature], property);
    }

    function setterSpinButton<K extends keyof Creature>(property: K,
        subProperty?: keyof Creature[K]): SpinButtonProps["onChange"] {
        return createSetterSpinButton([creature, setCreature], property, subProperty);
    }

    return (
        <div id="add-row" className={classes.row}>
            <Divider className={classes.divider}>add creature</Divider>
            <div id="add-row-fields" className={classes.fieldsContainer}>
                <Field
                    required
                    className={classes.field}
                    validationMessage={requiredIfEmpty(creature.initiative)}
                >
                    <SpinButton
                        className={classes.inputInitAc}
                        step={1}
                        value={creature.initiative}
                        onChange={setterSpinButton("initiative")}
                        placeholder="i"
                    />
                </Field>
                <Field
                    required
                    className={classes.field}
                    style={{ flexGrow: 0.7 }}
                    validationMessage={requiredIfEmpty(creature.name)}
                >
                    <Input
                        type="text"
                        value={creature.name ?? ""}
                        onChange={setterInput("name")}
                        placeholder="name"
                    />
                </Field>
                <div className={classes.fieldHpContainer}>
                    <Field
                        required
                        className={classes.field}
                        validationMessage={requiredIfEmpty(creature.hp.current)}
                    >
                        <SpinButton
                            className={classes.inputHp}
                            step={1} precision={1}
                            value={creature.hp.current}
                            onChange={setterSpinButton("hp", "current")}
                            placeholder="cur hp"
                        />
                    </Field>
                    <p className={classes.fieldHpSeparator}>/</p>
                    <Field
                        required
                        className={classes.field}
                        validationMessage={requiredIfEmpty(creature.hp.max)}
                    >
                        <SpinButton
                            className={classes.inputHp}
                            step={1} precision={1}
                            value={creature.hp.max}
                            onChange={setterSpinButton("hp", "max")}
                            placeholder="max hp"
                        />
                    </Field>
                </div>
                <div style={{ flexGrow: 1.6 }} />
                <Field
                    required
                    className={classes.field}
                    validationMessage={requiredIfEmpty(creature.ac)}
                >
                    <SpinButton
                        className={classes.inputInitAc}
                        step={1} precision={1}
                        value={creature.ac}
                        onChange={setterSpinButton("ac")}
                        placeholder="ac"
                    />
                </Field>
                <div style={{ flexGrow: 1 }} />
                <Button className={classes.field} icon={<AddSquareRegular />} onClick={onClickAdd} />
            </div>
            <Divider className={classes.divider} />
        </div>
    );
}
