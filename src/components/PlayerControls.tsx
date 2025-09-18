import { actionsByCreature, applyActions } from "../actions";
import {
    Button,
    Divider,
    makeStyles,
    mergeClasses,
    MessageBar,
    MessageBarBody,
    MessageBarTitle,
    Text,
    Title2,
    tokens,
    Tooltip,
} from "@fluentui/react-components";
import { Dispatch, useMemo } from "react";
import { FastForwardRegular, PlayRegular, RewindRegular, StopRegular } from "@fluentui/react-icons";
import { getDiff, sortByName } from "../util/creature_util";
import { cloneWithUpdated } from "../util/object_util";
import DamageDialog from "./dialogs/DamageDialog";
import HealDialog from "./dialogs/HealDialog";
import { LuWand } from "react-icons/lu";
import PendingAction from "./PendingAction";
import { sharedStyles } from "../util/shared_styles";

export interface PlayerState {
    isPlaying: boolean;
    activeCreatureId: Guid | undefined;
    pendingActions: Action[];
    round: number;
}

export function defaultPlayerState(): PlayerState {
    return {
        isPlaying: false,
        activeCreatureId: undefined,
        pendingActions: [],
        round: 1,
    };
}

interface Props {
    creatures: Creature[];
    state: {
        state: PlayerState;
        setState: Dispatch<PlayerState>;
    };
    history: {
        history: HistoryItem[][];
        historyIndex: number;
        addHistory: (items: HistoryItem[]) => void;
        rewindHistory: () => void;
        forwardHistory: () => void;
        removeFutureHistory: () => void;
    };
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

export default function PlayerControls({ creatures, state: { state, setState }, history }: Readonly<Props>) {
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

    const isInCurrentTime = history.historyIndex >= history.history.length;

    function startPlaying() {
        if (creatures.length === 0) {
            alert("Add some creatures to start playing!");
            return;
        }
        const startPlayer = initiativeOrder[0];
        setState({
            ...state,
            isPlaying: true,
            activeCreatureId: startPlayer.id,
        });
    }

    function goToPreviousTurn(): void {
        let round = state.round;
        let previousIndex = activeIndex - 1;
        if (previousIndex < 0) {
            previousIndex = initiativeOrder.length - 1;
            round--;
        }
        const previousCreature = initiativeOrder[previousIndex];
        setState({
            ...state,
            activeCreatureId: previousCreature.id,
            round: round,
            pendingActions: [],
        });
    }

    function goToNextTurn(): void {
        let round = state.round;
        let nextIndex = activeIndex + 1;
        if (nextIndex >= initiativeOrder.length) {
            nextIndex = 0;
            round++;
        }
        const nextCreature = initiativeOrder[nextIndex];
        setState({
            ...state,
            activeCreatureId: nextCreature.id,
            round: round,
            pendingActions: [],
        });
    }

    function rewindHistory() {
        history.rewindHistory();
        goToPreviousTurn();
    }

    function forwardHistory() {
        history.forwardHistory();
        goToNextTurn();
    }

    function stopPlaying() {
        setState(defaultPlayerState());
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
        if (!isInCurrentTime)
            history.removeFutureHistory();

        const newHistory: HistoryItem[] = resultingCreatures.map(result => ({
            round: state.round,
            initiative: activeCreature?.initiative ?? 0,
            actions: groupedActions[result.id],
            effect: getDiff(creatureMap[result.id], result),
        }));
        history.addHistory(newHistory);

        goToNextTurn();
    }

    function removePendingAction(item: Action) {
        const newPending = state.pendingActions.filter(h => h !== item);
        setState(cloneWithUpdated(state, "pendingActions", newPending));
    }

    let header, controls, effects;

    if (!state.isPlaying) {
        controls = <Button icon={<PlayRegular/>} onClick={startPlaying} />;
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
                <Title2>Round {state.round} – {activeCreature.name}&#39;s turn</Title2>
                <div className={classes.buttonGroup}>
                    <Tooltip content="Go backward one turn" relationship="label">
                        <Button
                            icon={<RewindRegular />}
                            disabled={history.historyIndex <= 0}
                            onClick={rewindHistory}
                        />
                    </Tooltip>
                    <Tooltip content="Go forward one turn" relationship="label">
                        <Button
                            icon={<FastForwardRegular />}
                            disabled={isInCurrentTime}
                            onClick={forwardHistory}
                        />
                    </Tooltip>
                    {stopButton}
                </div>
            </div>
        );
        controls = <>
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
            {!isInCurrentTime && <MessageBar intent="warning">
                <MessageBarBody>
                    <MessageBarTitle>You&#39;re back in history</MessageBarTitle>
                    Ending a turn now will remove all &#39;future&#39; actions from history.
                </MessageBarBody>
            </MessageBar>}
        </>;
        if (state.pendingActions.length > 0) {
            effects = (
                <fieldset className={mergeClasses(classes.fieldset, classes.effectsSection)}>
                    <legend>Effects</legend>
                    {state.pendingActions.map(a =>
                        <PendingAction key={a.id} action={a} removeAction={removePendingAction} />)}
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
