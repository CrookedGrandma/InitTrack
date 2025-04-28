import { makeStyles, Title1 } from "@fluentui/react-components";
import CreatureAdder from "../CreatureAdder";
import CreatureGrid from "../CreatureGrid";
import { useState } from "react";

const tempData: Creature[] = [
    {
        id: crypto.randomUUID(),
        initiative: 18,
        name: "Goblin",
        hp: {
            current: 10,
            max: 10,
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
        },
        ac: 0,
    },
];

const useStyles = makeStyles({
    container: {
        width: "100%",
        marginBlockEnd: "2rem",
    },
});

export default function Player() {
    const classes = useStyles();

    const [data, setData] = useState<Creature[]>(tempData);

    const editData = {
        addCreature: (creature: Creature) => setData([...data, creature]),
        deleteCreature: (creature: Creature) => setData(data.filter(c => c.id !== creature.id)),
        updateCreature: (creature: Creature) => setData(data.map(c => c.id === creature.id ? creature : c)),
    };

    return <>
        <Title1>Playing</Title1>
        <div id="table-container" className={classes.container}>
            <CreatureGrid data={data} editData={editData} />
        </div>
        <CreatureAdder addCreature={editData.addCreature} />
    </>;
}
