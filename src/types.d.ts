type AnyObject = { [key: string]: any };
type AnyFunction = (...args: any[]) => any;
type Prettify<T> = { [K in keyof T]: T[K] } & {};
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

type CreatureReference = Pick<Creature, "id" | "name">;

type CreatureEffect = { target: CreatureReference } & Partial<Pick<Creature, "hp" | "ac">>;

interface NameIcon {
    name: string;
    icon: ReactElement;
}

type HealType = { type: "normal" | "temp" } & NameIcon;

interface ActionBase {
    readonly id: Guid;
    source: CreatureReference;
    targets: CreatureReference[];
}

interface ActionMap {
    damage: {
        damageType: NameIcon;
        amount: number;
    };
    heal: {
        healType: HealType;
        amount: number;
    };
}

type Action = Prettify<{
    [K in keyof ActionMap]: { type: K } & ActionBase & ActionMap[K];
}[keyof ActionMap]>;

type ActionType<T extends keyof ActionMap> = Action & { type: T };

interface HistoryItem {
    actions: Action[];
    effect: CreatureEffect;
}
