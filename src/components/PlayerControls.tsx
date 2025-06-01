import { actionsByCreature, applyActions } from "../actions";
import { Button, Divider, makeStyles, mergeClasses, Text, Title2, tokens } from "@fluentui/react-components";
import { cloneWithUpdated, getDiff, sharedStyles, sortByName } from "../util";
import { Dispatch, useMemo } from "react";
import { FastForwardRegular, PlayRegular, StopRegular } from "@fluentui/react-icons";
import DamageDialog from "./dialogs/DamageDialog";
import HealDialog from "./dialogs/HealDialog";
import { LuWand } from "react-icons/lu";
import PendingAction from "./PendingAction";

export interface PlayerState {
    isPlaying: boolean;
    activeCreatureId: Guid | undefined;
    pendingActions: Action[];
}

export function defaultPlayerState(): PlayerState {
    return {
        isPlaying: false,
        activeCreatureId: undefined,
        pendingActions: [],
    };
}

interface Props {
    creatures: Creature[];
    state: {
        state: PlayerState;
        setState: Dispatch<PlayerState>;
    };
    applyHistory: (items: HistoryItem[]) => void;
}

const useStyles = makeStyles({
    controlArea: {
        width: "100%",
    },
    controlContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
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
    },
    controlButtons: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
    },
    effectsSection: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
    },
    buttonGroup: {
        display: "flex",
        alignItems: "start",
        gap: "0.5rem",
    },
});
const useSharedClasses = sharedStyles();

export default function PlayerControls({ creatures, state: { state, setState }, applyHistory }: Readonly<Props>) {
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

    const creatureMap = useMemo(() => Object.fromEntries(creatures.map(c => [c.id, c])), [creatures]);

    const groupedActions = useMemo(() => actionsByCreature(state.pendingActions), [state.pendingActions]);

    const resultingCreatures = useMemo(() => {
        const sortedTargets = sortByName(Object.keys(groupedActions).map(id => creatureMap[id]));
        return sortedTargets.map(t => applyActions(t, groupedActions[t.id]));
    }, [groupedActions, creatureMap]);

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

    function addDamage(damage: ActionType<"damage">) {
        setState(cloneWithUpdated(state, "pendingActions", [...state.pendingActions, damage]));
    }

    function addHeal(heal: ActionType<"heal">) {
        setState(cloneWithUpdated(state, "pendingActions", [...state.pendingActions, heal]));
    }

    function clickApplyStatus() {
        alert("Status effects are coming soon!");
    }

    function clickEndTurn() {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= initiativeOrder.length)
            nextIndex = 0;
        const nextCreature = initiativeOrder[nextIndex];
        let newState = cloneWithUpdated(state, "activeCreatureId", nextCreature.id);

        if (resultingCreatures.length > 0) {
            const newHistory = resultingCreatures.map(result => ({
                actions: groupedActions[result.id],
                effect: getDiff(creatureMap[result.id], result),
            }));
            applyHistory(newHistory);
        }
        newState = cloneWithUpdated(newState, "pendingActions", []);

        setState(newState);
    }

    function removeHistoryItem(item: Action) {
        const newHistory = state.pendingActions.filter(h => h !== item);
        setState(cloneWithUpdated(state, "pendingActions", newHistory));
    }

    let header, controls, effects;

    if (!state.isPlaying) {
        controls = <Button icon={<PlayRegular/>} onClick={startPlaying}/>;
    }
    else if (!activeCreature) {
        controls = <>
            <Text className={sharedClasses.danger}>
                Could not find creature with ID {state.activeCreatureId}
            </Text>
            {stopButton}
        </>;
    }
    else {
        header = (
            <div className={classes.header}>
                <Title2>{activeCreature.name}&#39;s turn</Title2>
                {stopButton}
            </div>
        );
        controls = (
            <fieldset className={mergeClasses(classes.fieldset, classes.controlButtons)}>
                <legend>Controls</legend>
                <div className={classes.buttonGroup}>
                    <DamageDialog
                        activeCreature={activeCreature}
                        creatures={creatures}
                        processDamage={addDamage}
                    />
                    <HealDialog
                        activeCreature={activeCreature}
                        creatures={creatures}
                        processHeal={addHeal}
                    />
                    <Button disabled onClick={clickApplyStatus} icon={<LuWand />}>Apply status</Button> {/* use TagPicker for this */}
                </div>
                <Button onClick={clickEndTurn} icon={<FastForwardRegular />}>End turn</Button>
            </fieldset>
        );
        if (state.pendingActions.length > 0) {
            effects = (
                <fieldset className={mergeClasses(classes.fieldset, classes.effectsSection)}>
                    <legend>Effects</legend>
                    {state.pendingActions.map(a =>
                        <PendingAction key={a.id} action={a} removeAction={removeHistoryItem} />)}
                    <Divider />
                    <div>
                        <Text>Targeted creatures after this turn:</Text>
                        <ul>
                            {resultingCreatures.map(c => (
                                <Text key={c.id}><li>
                                    {c.name} (AC {c.ac}): {c.hp.current} / {c.hp.max} (+{c.hp.temp})
                                </li></Text>
                            ))}
                        </ul>
                    </div>
                </fieldset>
            );
        }
    }

    return (
        <div className={classes.controlArea}>
            <Divider>controls</Divider>
            <div className={classes.controlContainer}>
                {header}
                {controls}
                {effects}
            </div>
        </div>
    );
}
