type AnyObject = { [key: string]: any };

type OptionalNull<T extends AnyObject> = {
    [K in keyof T]: T[K] extends AnyObject
        ? OptionalNull<T[K]>
        : T[K] | null;
};

type Parent<T = ReactNode> = Readonly<{ children: T }>;
type DefaultValue<T> = Readonly<{ defaultValue: T }>;

interface Creature {
    initiative: number;
    name: string;
    hp: {
        current: number;
        max: number;
    };
    ac: number;
}
