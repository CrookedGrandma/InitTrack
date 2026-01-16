import { InputOnChangeData, InputProps, SpinButtonOnChangeData, SpinButtonProps } from "@fluentui/react-components";
import { Dispatch } from "react";

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
            throw new Error("No creature is set");
        setCreature({ ...creature, [property]: data.value });
    };
}

export function createSetterSpinButton<K extends keyof Creature>(
    [creature, setCreature]: [OptionalNull<Creature>, Dispatch<OptionalNull<Creature>>],
    property: K,
    subProperty?: keyof Creature[K]): SpinButtonProps["onChange"] {
    return (_: any, data: SpinButtonOnChangeData) => {
        if (!creature)
            throw new Error("No creature is set");
        const value = getSpinButtonValue(data);
        const propertyValue = subProperty
            ? { ...creature[property] as AnyObject, [subProperty]: value }
            : value;
        setCreature({ ...creature, [property]: propertyValue });
    };
}
