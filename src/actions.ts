function damageCreature(creature: Creature, damage: number): Creature {
    const tempHpRemoved = Math.min(damage, creature.hp.temp);
    const hpRemoved = Math.min(damage - tempHpRemoved, creature.hp.current);
    return {
        ...creature,
        hp: {
            ...creature.hp,
            temp: creature.hp.temp - tempHpRemoved,
            current: creature.hp.current - hpRemoved,
        },
    };
}

function healCreature(creature: Creature, heal: number, type: HealType["type"]): Creature {
    let hp = creature.hp;
    if (type === "normal") {
        hp = {
            ...hp,
            current: Math.min(hp.max, hp.current + heal),
        };
    }
    if (type === "temp") {
        hp = {
            ...hp,
            temp: Math.max(hp.temp, heal),
        };
    }
    return {
        ...creature,
        hp: hp,
    };
}

export function applyAction(creature: Creature, action: Action): Creature {
    switch (action.type) {
        case "damage":
            creature = damageCreature(creature, action.amount);
            break;
        case "heal":
            creature = healCreature(creature, action.amount, action.healType.type);
            break;
    }
    return creature;
}

export function applyActions(creature: Creature, actions: Action[]): Creature {
    return actions.reduce(applyAction, creature);
}

export function actionsByCreature(actions: Action[]): Record<Guid, Action[]> {
    return actions.reduce<Record<Guid, Action[]>>((acc, action) => {
        for (const target of action.targets)
            acc[target.id] = [...(acc[target.id] ?? []), action];
        return acc;
    }, {});
}
