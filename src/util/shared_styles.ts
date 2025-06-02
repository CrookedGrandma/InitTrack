import { makeStyles, tokens } from "@fluentui/react-components";

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
