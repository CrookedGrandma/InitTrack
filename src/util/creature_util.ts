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

export function findCreature(creatures: Creature[], target: CreatureReference): Creature {
    const creature = creatures.find(c => c.id === target.id);
    if (!creature)
        throw Error("Creature not found");
    return creature;
}

export function sortByName<T extends CreatureReference>(creatures: T[]): T[] {
    return creatures.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function getDiff(before: Creature, after: Creature): CreatureEffect {
    return {
        target: before,
        hp: {
            current: after.hp.current - before.hp.current,
            max: after.hp.max - before.hp.max,
            temp: after.hp.temp - before.hp.temp,
        },
        ac: after.ac - before.ac,
    };
}

export function applyEffect(creature: Creature, effect: CreatureEffect): Creature {
    return {
        ...creature,
        hp: {
            current: creature.hp.current + (effect.hp?.current ?? 0),
            max: creature.hp.max + (effect.hp?.max ?? 0),
            temp: creature.hp.temp + (effect.hp?.temp ?? 0),
        },
        ac: creature.ac + (effect.ac ?? 0),
    };
}
