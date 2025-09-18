import { applyEffect, findCreature } from "../../util/creature_util";
import { ComponentProps, useState } from "react";
import { makeStyles, Title1 } from "@fluentui/react-components";
import PlayerControls, { defaultPlayerState, PlayerState } from "../PlayerControls";
import CreatureAdder from "../CreatureAdder";
import CreatureGrid from "../CreatureGrid";
import HistoryDialog from "../dialogs/HistoryDialog";

const tempData: Creature[] = [
    {
        id: crypto.randomUUID(),
        initiative: 18,
        name: "Goblin",
        hp: {
            current: 10,
            max: 10,
            temp: 2,
        },
        ac: 12,
    },
    {
        id: crypto.randomUUID(),
        initiative: 15,
        name: "Evil Wizard",
        hp: {
            current: 10,
            max: 15,
            temp: 3,
        },
        ac: 14,
    },
    {
        id: crypto.randomUUID(),
        initiative: 20,
        name: "De Grote Held",
        hp: {
            current: 2,
            max: 20,
            temp: 0,
        },
        ac: 18,
    },
    {
        id: crypto.randomUUID(),
        initiative: 1,
        name: "Dooie makker",
        hp: {
            current: 0,
            max: 169,
            temp: 0,
        },
        ac: 0,
    },
];

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
});

export default function Player() {
    const classes = useStyles();

    const [creatures, setCreatures] = useState<Creature[]>(tempData);
    const [playerState, setPlayerState] = useState<PlayerState>(defaultPlayerState());
    const [history, setHistory] = useState<HistoryItem[][]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);

    function updateCreatures(updated: Creature[]) {
        setCreatures(creatures.map(c => updated.find(u => u.id === c.id) ?? c));
    }

    const editData: ComponentProps<typeof CreatureGrid>["editData"] & Record<string, (creature: Creature) => void> = {
        addCreature: (creature: Creature) => setCreatures([...creatures, creature]),
        deleteCreature: (creature: Creature) => setCreatures(creatures.filter(c => c.id !== creature.id)),
        updateCreature: (creature: Creature) => updateCreatures([creature]),
    };

    function applyHistoryItems(items: HistoryItem[], reverse: boolean = false) {
        const updated = items.map(item => {
            const effect = item.effect;
            const target = findCreature(creatures, effect.target);
            return applyEffect(target, effect, reverse);
        });
        updateCreatures(updated);
    }

    function addHistory(items: HistoryItem[]) {
        setHistory(history => [...history, items]);
        setHistoryIndex(historyIndex + 1);
        applyHistoryItems(items);
    }

    function rewindHistory() {
        if (historyIndex <= 0)
            return;
        const items = history[historyIndex - 1];
        applyHistoryItems(items, true);
        setHistoryIndex(historyIndex - 1);
    }

    function forwardHistory() {
        if (historyIndex >= history.length)
            return;
        const items = history[historyIndex];
        applyHistoryItems(items);
        setHistoryIndex(historyIndex + 1);
    }

    const historyData: ComponentProps<typeof PlayerControls>["history"] = {
        history,
        historyIndex,
        addHistory,
        rewindHistory,
        forwardHistory,
        removeFutureHistory: () => setHistory(history => history.slice(0, historyIndex)),
    };

    return <>
        <Title1>Playing</Title1>
        <div id="table-container" className={classes.container}>
            <CreatureGrid creatures={creatures} activeCreature={playerState.activeCreatureId} editData={editData} />
        </div>
        <CreatureAdder addCreature={editData.addCreature} />
        <PlayerControls
            creatures={creatures}
            state={{ state: playerState, setState: setPlayerState }}
            history={historyData}
        />
        <HistoryDialog history={history} historyIndex={historyIndex} />
    </>;
}
