import { utils, writeFile } from "xlsx";

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

export function applyEffect(creature: Creature, effect: CreatureEffect, reverse: boolean = false): Creature {
    const mod = reverse ? -1 : 1;
    return {
        ...creature,
        hp: {
            current: creature.hp.current + mod * (effect.hp?.current ?? 0),
            max: creature.hp.max + mod * (effect.hp?.max ?? 0),
            temp: creature.hp.temp + mod * (effect.hp?.temp ?? 0),
        },
        ac: creature.ac + mod * (effect.ac ?? 0),
    };
}
export function flatten(creature: Creature) {
    return {
        id: creature.id,
        initiative: creature.initiative,
        name: creature.name,
        hp_current: creature.hp.current,
        hp_max: creature.hp.max,
        hp_temp: creature.hp.temp,
        ac: creature.ac,
    };
}

export function exportCreatures(creatures: Creature[]): void {
    const worksheet = utils.json_to_sheet(creatures.map(flatten));
    const workbook = utils.book_new(worksheet, "creatures");
    writeFile(workbook, "creatures.xlsx");
}
