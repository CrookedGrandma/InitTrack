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

type CreatureReference = Pick<Creature, "id" | "name">;

type CreatureEffect = { target: CreatureReference } & Partial<Pick<Creature, "hp" | "ac">>;

interface DamageType {
    name: string;
    icon: ReactElement;
}

interface ActionBase {
    readonly id: Guid;
    type: "damage" | "heal";
    source: CreatureReference;
    targets: CreatureReference[];
}

interface DamageAction extends ActionBase {
    type: "damage";
    damageType: DamageType;
    amount: number;
}

interface HealAction extends ActionBase {
    type: "heal";
    healType: "normal" | "temp";
    amount: number;
}

type Action = DamageAction | HealAction;

interface HistoryItem {
    actions: Action[];
    effect: CreatureEffect;
}
