import { makeStyles, Title1 } from "@fluentui/react-components";
import CreatureAdder from "../CreatureAdder";
import CreatureGrid from "../CreatureGrid";
import { useState } from "react";

const tempData: Creature[] = [
    {
        initiative: 18,
        name: "Goblin",
        hp: {
            current: 10,
            max: 10,
        },
        ac: 12,
    },
    {
        initiative: 15,
        name: "Evil Wizard",
        hp: {
            current: 10,
            max: 15,
        },
        ac: 14,
    },
    {
        initiative: 20,
        name: "De Grote Held",
        hp: {
            current: 2,
            max: 20,
        },
        ac: 18,
    },
    {
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

    const addCreature = (creature: Creature) => setData([...data, creature]);
    const deleteCreature = (creature: Creature) => setData(data.filter(c => c !== creature));

    return <>
        <Title1>Playing</Title1>
        <div id="table-container" className={classes.container}>
            <CreatureGrid data={data} deleteCreature={deleteCreature} />
        </div>
        <CreatureAdder addCreature={addCreature} />
    </>;
}
