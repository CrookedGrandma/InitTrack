import { Button, Divider, makeStyles, Text, Title2, tokens } from "@fluentui/react-components";
import { cloneWithUpdated, sharedStyles } from "../util";
import { Dispatch, useMemo } from "react";
import { FastForwardRegular, PlayRegular, StopRegular } from "@fluentui/react-icons";
import { LuShieldPlus, LuSwords, LuWand } from "react-icons/lu";

export interface PlayerState {
    isPlaying: boolean;
    activeCreatureId: Guid | undefined;
}

export function defaultPlayerState(): PlayerState {
    return {
        isPlaying: false,
        activeCreatureId: undefined,
    };
}

interface Props {
    creatures: Creature[];
    state: {
        state: PlayerState;
        setState: Dispatch<PlayerState>;
    };
}

const useStyles = makeStyles({
    controlArea: {
        width: "100%",
    },
    controlContainer: {
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "calc(100% - 1rem)",
        padding: "0 0.5rem",
    },
    fieldset: {
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRadius: tokens.borderRadiusLarge,
        padding: "0.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
    },
    buttonGroup: {
        display: "flex",
        alignItems: "start",
        gap: "0.5rem",
    },
});
const useSharedClasses = sharedStyles();

export default function PlayerControls({ creatures, state: { state, setState } }: Readonly<Props>) {
    const classes = useStyles();
    const sharedClasses = useSharedClasses();

    const initiativeOrder = useMemo(() => creatures.toSorted((a, b) => b.initiative - a.initiative), [creatures]);
    const [activeIndex, activeCreature] = useMemo(() => {
        const activeIndex = initiativeOrder.findIndex(c => c.id === state.activeCreatureId);
        return [
            activeIndex,
            activeIndex >= 0 ? initiativeOrder[activeIndex] : undefined,
        ];
    }, [initiativeOrder, state.activeCreatureId]);

    function startPlaying() {
        if (creatures.length === 0) {
            alert("Add some creatures to start playing!");
            return;
        }
        const startPlayer = initiativeOrder[0];
        let newState = cloneWithUpdated(state, "isPlaying", true);
        newState = cloneWithUpdated(newState, "activeCreatureId", startPlayer.id);
        setState(newState);
    }

    function stopPlaying() {
        let newState = cloneWithUpdated(state, "isPlaying", false);
        newState = cloneWithUpdated(newState, "activeCreatureId", undefined);
        setState(newState);
    }
    const stopButton = <Button icon={<StopRegular />} onClick={stopPlaying} />;

    function clickDamage() {
        alert("Damage is coming soon!");
    }

    function clickHeal() {
        alert("Healing is coming soon!");
    }

    function clickApplyStatus() {
        alert("Status effects are coming soon!");
    }

    function clickEndTurn() {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= initiativeOrder.length)
            nextIndex = 0;
        const nextCreature = initiativeOrder[nextIndex];
        setState(cloneWithUpdated(state, "activeCreatureId", nextCreature.id));
    }

    return (
        <div className={classes.controlArea}>
            <Divider>controls</Divider>
            <div className={classes.controlContainer}>
                {(() => {
                    if (!state.isPlaying)
                        return <Button icon={<PlayRegular />} onClick={startPlaying} />;
                    if (!activeCreature) {
                        return <>
                            <Text className={sharedClasses.danger}>
                                Could not find creature with ID {state.activeCreatureId}
                            </Text>
                            {stopButton}
                        </>;
                    }
                    return <>
                        <div className={classes.header}>
                            <Title2>{activeCreature.name}&#39;s turn</Title2>
                            {stopButton}
                        </div>
                        <fieldset className={classes.fieldset}>
                            <legend>Controls</legend>
                            <div className={classes.buttonGroup}>
                                <Button disabled onClick={clickDamage} icon={<LuSwords />}>Damage</Button>
                                <Button disabled onClick={clickHeal} icon={<LuShieldPlus />}>Heal</Button>
                                <Button disabled onClick={clickApplyStatus} icon={<LuWand />}>Apply status</Button>
                            </div>
                            <Button onClick={clickEndTurn} icon={<FastForwardRegular />}>End turn</Button>
                        </fieldset>
                    </>;
                })()}
            </div>
        </div>
    );
}
