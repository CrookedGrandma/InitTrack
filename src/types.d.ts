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

// Makes a Discriminated Union of all the given types, with a `type` property that is the key of the type.
// Optionally adds the `TAdd` type to all types.
type DiscoUnion<TMap extends AnyObject, TAdd = never> = Prettify<{
    [P in keyof TMap]: { type: P } & (TAdd extends never ? object : TAdd) & TMap[P]
}[keyof TMap]>;
// Selects a specific type from the given Discriminated Union.
type DiscoUnionType<TUnion extends DiscoUnion<AnyObject>, T extends TUnion["type"]> = Extract<TUnion, { type: T }>;

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

type Action = DiscoUnion<ActionMap, ActionBase>;
type ActionType<T extends Action["type"]> = DiscoUnionType<Action, T>;

interface HistoryItem {
    round: number;
    initiative: number;
    actions: Action[];
    effect: CreatureEffect;
}
