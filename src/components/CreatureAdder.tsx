import {
    Button,
    Divider,
    Field,
    Input,
    InputOnChangeData,
    makeStyles,
    SpinButton,
    SpinButtonOnChangeData,
    tokens,
} from "@fluentui/react-components";
import { emptyCreature, isValidCreature } from "../util";
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
        justifyContent: "space-between",
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

    function setterInput(property: keyof Creature) {
        return (_: any, data: InputOnChangeData) => {
            console.log(data);
            setCreature({ ...creature, [property]: data.value });
        };
    }

    function setterSpinButton<
        K extends keyof Creature,
        SubK extends keyof Creature[K] | undefined = undefined,
    >(property: K, subProperty?: SubK) {
        return (_: any, data: SpinButtonOnChangeData) => {
            console.log(data);
            let value: number | null = data.value ?? parseInt(data.displayValue as string);
            if (Number.isNaN(value))
                value = null;
            const propertyValue = subProperty
                ? { ...creature[property] as AnyObject, [subProperty]: value }
                : value;
            setCreature({ ...creature, [property]: propertyValue });
        };
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
