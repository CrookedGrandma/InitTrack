import { Field, SpinButton, SpinButtonOnChangeData } from "@fluentui/react-components";
import { getSpinButtonValue } from "../util";

interface Props {
    label: string;
    value: number | null;
    setValue: (value: number) => void;
    fallbackValue?: number;
}

function getInt(data: SpinButtonOnChangeData, fallback: number): number {
    const value = getSpinButtonValue(data);
    return value != null ? Math.floor(value) : fallback;
}

export default function IntField({ label, value, setValue, fallbackValue }: Readonly<Props>) {
    return (
        <Field label={label}>
            <SpinButton
                value={value}
                onChange={(_, data) => setValue(getInt(data, fallbackValue ?? 1))}
                min={1}
                step={1}
            />
        </Field>
    );
}
