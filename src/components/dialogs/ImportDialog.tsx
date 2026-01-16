import {
    Button,
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Input,
    makeStyles,
    mergeClasses,
    MessageBar,
    MessageBarBody,
    SpinButton,
    Switch,
    TableCellLayout,
    TableColumnDefinition,
    Text,
} from "@fluentui/react-components";
import { ColId, xlsxSheetName } from "../../constants";
import { createSetterInput, createSetterSpinButton } from "../../util/input_util";
import { Dispatch, SetStateAction, useState } from "react";
import { isValidCreature, unflatten } from "../../util/creature_util";
import { read, utils } from "xlsx";
import { creatureGridColumnSizes } from "../../util/component_util";
import FileInput from "../FileInput";
import { FolderArrowUpRegular } from "@fluentui/react-icons";

interface ImportDialogProps {
    setCreatures: Dispatch<SetStateAction<Creature[]>>;
}

const useStyles = makeStyles({
    dialog: {
        width: "800px",
        maxWidth: "800px",
        boxSizing: "border-box",
    },
    hpInputContainer: {
        display: "flex",
    },
    hpInput: {
        width: "5rem",
    },
    hpInputSeparator: {
        lineHeight: "32px",
    },
});

export default function ImportDialog({ setCreatures }: Readonly<ImportDialogProps>) {
    const [open, setOpen] = useState(false);
    const [importingCreatures, setImportingCreatures] = useState<OptionalNull<Creature>[]>([]);
    const [shouldClear, setShouldClear] = useState<boolean>(false);
    const [showWarning, setShowWarning] = useState<boolean>(false);

    const classes = useStyles();

    async function handleFileSelect(files: FileList) {
        setOpen(true);
        if (files.length === 0)
            return;
        const bytes = await files[0].arrayBuffer();
        const workbook = read(bytes);
        const worksheet = workbook.Sheets[xlsxSheetName];
        const data = utils.sheet_to_json<(string | number)[]>(worksheet, { header: 1 });
        const keys = data[0] as string[];
        const flatCreatures = data.slice(1).map(row =>
            keys.reduce((creature, key, index) =>
                ({ ...creature, [key]: row[index] }),
            {} as FlatCreature));
        const creatures = flatCreatures.map(unflatten);
        for (const creature of creatures) {
            creature.id = crypto.randomUUID();
            creature.hp.temp ??= 0;
        }
        setImportingCreatures(creatures);
    }

    function close(shouldImport: boolean) {
        if (shouldImport) {
            const toImport = importingCreatures.filter(isValidCreature);
            if (toImport.length !== importingCreatures.length) {
                setShowWarning(true);
                return;
            }
            if (shouldClear) {
                setCreatures(toImport);
            }
            else {
                setCreatures(creatures => [...creatures, ...toImport]);
            }
        }
        setOpen(false);
        setImportingCreatures([]);
        setShouldClear(false);
        setShowWarning(false);
    }

    function setCreature(creature: OptionalNull<Creature>) {
        setImportingCreatures(creatures => creatures.map(c => c.id === creature.id ? creature : c));
    }

    const columns: TableColumnDefinition<Creature>[] = [
        createTableColumn<Creature>({
            columnId: ColId.Initiative,
            compare: (a, b) => a.initiative - b.initiative,
            renderHeaderCell: () => <Text title="Initiative">i</Text>,
            renderCell: creature => <TableCellLayout>
                <SpinButton
                    value={creature.initiative ?? null}
                    onChange={createSetterSpinButton([creature, setCreature], "initiative")}
                />
            </TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.Name,
            renderHeaderCell: () => <Text title="Name">name</Text>,
            renderCell: creature => <TableCellLayout appearance="primary">
                <Input
                    type="text"
                    value={creature.name}
                    onChange={createSetterInput([creature, setCreature], "name")}
                />
            </TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.HP,
            renderHeaderCell: () => <Text title="HP">hp</Text>,
            renderCell: creature => (
                <div className={mergeClasses(classes.hpInputContainer, classes.hpInputSeparator)}>
                    <SpinButton
                        className={classes.hpInput}
                        step={1}
                        value={creature.hp.current ?? null}
                        onChange={createSetterSpinButton([creature, setCreature], "hp", "current")}
                        placeholder="current"
                    />
                    <p>/</p>
                    <SpinButton
                        className={classes.hpInput}
                        step={1}
                        value={creature.hp.max ?? null}
                        onChange={createSetterSpinButton([creature, setCreature], "hp", "max")}
                        placeholder="max"
                    />
                    <p>(+</p>
                    <SpinButton
                        className={classes.hpInput}
                        step={1}
                        value={creature.hp.temp}
                        onChange={createSetterSpinButton([creature, setCreature], "hp", "temp")}
                        placeholder="temp"
                    />
                    <p>)</p>
                </div>
            ),
        }),
        createTableColumn<Creature>({
            columnId: ColId.AC,
            renderHeaderCell: () => <Text title="AC">ac</Text>,
            renderCell: creature => <TableCellLayout>
                <SpinButton
                    step={1}
                    value={creature.ac ?? null}
                    onChange={createSetterSpinButton([creature, setCreature], "ac")}
                />
            </TableCellLayout>,
        }),
    ];

    return (
        <Dialog open={open}>
            <DialogTrigger>
                <FileInput onFileSelect={handleFileSelect} />
            </DialogTrigger>
            <DialogSurface className={classes.dialog}>
                <DialogBody>
                    <DialogTitle>Import creatures</DialogTitle>
                    <DialogContent>
                        <DataGrid
                            items={importingCreatures}
                            columns={columns}
                            resizableColumns
                            columnSizingOptions={creatureGridColumnSizes(true)}
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
                        {showWarning && (
                            <MessageBar intent="error">
                                <MessageBarBody>All fields have to be filled before importing</MessageBarBody>
                            </MessageBar>
                        )}
                        <Switch
                            checked={shouldClear}
                            onChange={(e, data) => setShouldClear(data.checked)}
                            label="Clear existing creatures before importing"
                        />
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger>
                            <Button
                                appearance="primary"
                                onClick={() => close(true)}
                                icon={<FolderArrowUpRegular />}
                            >Import</Button>
                        </DialogTrigger>
                        <DialogTrigger>
                            <Button
                                appearance="secondary"
                                onClick={() => close(false)}
                            >Cancel</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
