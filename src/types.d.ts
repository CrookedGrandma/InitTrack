type AnyObject = { [key: string]: any };

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
