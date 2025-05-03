type AnyObject = { [key: string]: any };
type AnyFunction = (...args: any[]) => any;
type Guid = ReturnType<typeof crypto.randomUUID>;

// Recursively makes all properties of the given type accept null as a value
type OptionalNull<T extends AnyObject> = {
    [K in keyof T]: T[K] extends AnyObject
        ? OptionalNull<T[K]>
        : T[K] | null;
};

type Parent<T = ReactNode> = Readonly<{ children: T }>;
type DefaultValue<T> = Readonly<{ defaultValue: T }>;

interface Creature {
    readonly id: Guid;
    initiative: number;
    name: string;
    hp: {
        current: number;
        max: number;
        temp: number;
    };
    ac: number;
}
