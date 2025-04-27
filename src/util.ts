export function emptyCreature(): OptionalNull<Creature> {
    return {
        initiative: null,
        name: null,
        hp: {
            current: null,
            max: null,
        },
        ac: null,
    };
}

export function isValidCreature(creature: OptionalNull<Creature>): creature is Creature {
    return creature.initiative != null
        && creature.name != null
        && creature.hp.current != null
        && creature.hp.max != null
        && creature.ac != null;
}
