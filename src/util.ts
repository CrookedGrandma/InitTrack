import {
    InputOnChangeData,
    InputProps,
    makeStyles,
    SpinButtonOnChangeData,
    SpinButtonProps,
    tokens,
} from "@fluentui/react-components";
import { Dispatch } from "react";

export function cloneWithout<T extends AnyObject>(obj: T, key: keyof T): Omit<T, keyof T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used to remove the key from the object
    return (({ [key]: _, ...rest }) => rest)(obj);
}

export function cloneWithUpdated<T extends AnyObject, K extends keyof T>(obj: T, key: K, value: T[K]): T {
    return { ...obj, [key]: value };
}

export function emptyCreature(): OptionalNull<Creature> {
    return {
        id: crypto.randomUUID(),
        initiative: null,
        name: null,
        hp: {
            current: null,
            max: null,
            temp: null,
        },
        ac: null,
    };
}

export function isValidCreature(creature: OptionalNull<Creature>): creature is Creature {
    return creature.initiative != null
        && creature.name != null
        && creature.hp.current != null
        && creature.hp.max != null
        && creature.hp.temp != null
        && creature.ac != null;
}

export function sortByName(creatures: Creature[]): Creature[] {
    return creatures.sort((a, b) => a.name.localeCompare(b.name));
}

export function sharedStyles() {
    return makeStyles({
        danger: {
            color: tokens.colorStatusDangerForeground1,
        },
        dangerHover: {
            ["&:hover"]: {
                color: tokens.colorStatusDangerBackground3Hover,
            },
            ["&:active"]: {
                color: tokens.colorStatusDangerBackground3Pressed,
            },
        },
    });
}

export function getSpinButtonValue(data: SpinButtonOnChangeData): number | null {
    let value: number | null = data.value ?? parseFloat(data.displayValue as string);
    if (Number.isNaN(value))
        value = null;
    return value;
}

export function createSetterInput(
    [creature, setCreature]: [OptionalNull<Creature>, Dispatch<OptionalNull<Creature>>],
    property: keyof Creature): InputProps["onChange"] {
    return (_: any, data: InputOnChangeData) => {
        if (!creature)
            throw Error("No creature is set");
        setCreature({ ...creature, [property]: data.value });
    };
}

export function createSetterSpinButton<K extends keyof Creature>(
    [creature, setCreature]: [OptionalNull<Creature>, Dispatch<OptionalNull<Creature>>],
    property: K,
    subProperty?: keyof Creature[K]): SpinButtonProps["onChange"] {
    return (_: any, data: SpinButtonOnChangeData) => {
        if (!creature)
            throw Error("No creature is set");
        const value = getSpinButtonValue(data);
        const propertyValue = subProperty
            ? { ...creature[property] as AnyObject, [subProperty]: value }
            : value;
        setCreature({ ...creature, [property]: propertyValue });
    };
}
