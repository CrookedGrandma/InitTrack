import {
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    Field,
    FieldProps,
    makeStyles,
    ProgressBar,
    ProgressBarProps,
    TableCellLayout,
    TableColumnDefinition,
    TableColumnSizingOptions,
    Text,
    Title1,
} from "@fluentui/react-components";

interface Creature {
    initiative: number;
    name: string;
    hp: {
        current: number;
        max: number;
    };
    ac: number;
}

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
];

enum ColId {
    Initiative = "initiative",
    Name = "name",
    HP = "hp",
    AC = "ac",
}

type ValState = FieldProps["validationState"];
type PBColor = ProgressBarProps["color"];
function getProgressBarProps(hp: Creature["hp"]): [validationState: ValState, color: PBColor] {
    const hpFull = hp.current >= hp.max;
    const hpCritical = hp.current * 10 <= hp.max; // under 10%
    if (hpFull)
        return ["success", "success"];
    if (hpCritical)
        return ["warning", "warning"];
    return ["none", "brand"];
}

const colSizes: TableColumnSizingOptions = {
    [ColId.Initiative]: {
        minWidth: 20,
        idealWidth: 20,
    },
    [ColId.Name]: {
        autoFitColumns: true,
        idealWidth: 250,
    },
    [ColId.HP]: {
        minWidth: 100,
        idealWidth: 300,
    },
    [ColId.AC]: {
        minWidth: 20,
        idealWidth: 20,
    },
};

const useStyles = makeStyles({
    container: {
        width: "100%",
    },
    table: {
        width: "100%",
    },
    bar: {
        width: "100%",
    },
});

export default function Player() {
    const classes = useStyles();

    const columns: TableColumnDefinition<Creature>[] = [
        createTableColumn<Creature>({
            columnId: ColId.Initiative,
            compare: (a, b) => a.initiative - b.initiative,
            renderHeaderCell: () => <Text title="Initiative">i</Text>,
            renderCell: creature => <TableCellLayout>{creature.initiative}</TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.Name,
            renderHeaderCell: () => <Text title="Name">name</Text>,
            renderCell: creature => <TableCellLayout appearance="primary">{creature.name}</TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.HP,
            renderHeaderCell: () => <Text title="HP">hp</Text>,
            renderCell: creature => {
                const hp = creature.hp;
                const [validationState, color] = getProgressBarProps(hp);
                return (
                    <TableCellLayout content={{ className: classes.bar }}>
                        <Field
                            validationMessage={`${hp.current} / ${hp.max}`}
                            validationState={validationState}
                        >
                            <ProgressBar value={hp.current} max={hp.max} color={color} thickness="large" />
                        </Field>
                    </TableCellLayout>
                );
            },
        }),
        createTableColumn<Creature>({
            columnId: ColId.AC,
            renderHeaderCell: () => <Text title="AC">ac</Text>,
            renderCell: creature => <TableCellLayout>{creature.ac}</TableCellLayout>,
        }),
    ];

    return <>
        <Title1>Playing</Title1>
        <div id="table-container" className={classes.container}>
            <DataGrid
                className={classes.table}
                items={tempData}
                columns={columns}
                sortable
                sortState={{ sortColumn: ColId.Initiative, sortDirection: "descending" }}
                resizableColumns
                columnSizingOptions={colSizes}
            >
                <DataGridHeader>
                    <DataGridRow>
                        {col => <DataGridHeaderCell>{col.renderHeaderCell()}</DataGridHeaderCell>}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<Creature>>
                    {row => (
                        <DataGridRow<Creature> key={row.rowId}>
                            {col => (
                                <DataGridCell>{col.renderCell(row.item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
        </div>
    </>;
}
