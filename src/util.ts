import { makeStyles, tokens } from "@fluentui/react-components";

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

export function sharedStyles() {
    return makeStyles({
        danger: {
            color: tokens.colorStatusDangerForeground1,
        },
        dangerHover: {
            ["&:hover"]: {
                color: tokens.colorStatusDangerBackground3Hover,
            },
            ["&:active"]: {
                color: tokens.colorStatusDangerBackground3Pressed,
            },
        },
    });
}
