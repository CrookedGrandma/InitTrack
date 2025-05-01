import { Button, Divider, makeStyles } from "@fluentui/react-components";
import { PlayRegular, StopRegular } from "@fluentui/react-icons";
import { cloneWithUpdated } from "../util";
import { Dispatch } from "react";

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
});

export default function PlayerControls({ creatures, state: { state, setState } }: Readonly<Props>) {
    const classes = useStyles();

    function sortedCreatures() {
        return creatures.toSorted((a, b) => b.initiative - a.initiative);
    }

    function startPlaying() {
        if (creatures.length === 0) {
            alert("Add some creatures to start playing!");
            return;
        }
        const startPlayer = sortedCreatures()[0];
        let newState = cloneWithUpdated(state, "isPlaying", true);
        newState = cloneWithUpdated(newState, "activeCreatureId", startPlayer.id);
        setState(newState);
    }

    function stopPlaying() {
        let newState = cloneWithUpdated(state, "isPlaying", false);
        newState = cloneWithUpdated(newState, "activeCreatureId", undefined);
        setState(newState);
    }

    let controls = <Button icon={<PlayRegular />} onClick={startPlaying} />;

    if (state.isPlaying) {
        controls = <Button icon={<StopRegular />} onClick={stopPlaying} />;
    }

    return (
        <div className={classes.controlArea}>
            <Divider>controls</Divider>
            {controls}
        </div>
    );
}
