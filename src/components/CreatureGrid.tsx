import {
    Button,
    createTableColumn,
    DataGrid,
    DataGridBody,
    DataGridCell,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridRow,
    Field,
    FieldProps,
    Input,
    InputProps,
    makeStyles,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    mergeClasses,
    ProgressBar,
    ProgressBarProps,
    SpinButton,
    SpinButtonProps,
    TableCellLayout,
    TableColumnDefinition,
    TableColumnSizingOptions,
    Text,
    tokens,
} from "@fluentui/react-components";
import {
    CheckmarkFilled,
    DeleteFilled,
    DismissFilled,
    EditRegular,
    HeartFilled,
    HeartOffRegular,
    MoreVerticalFilled,
} from "@fluentui/react-icons";
import { cloneWithout, createSetterInput, createSetterSpinButton, isValidCreature, sharedStyles } from "../util";
import { useState } from "react";

enum ColId {
    Initiative = "initiative",
    Name = "name",
    HP = "hp",
    AC = "ac",
    Actions = "actions",
}

type ValState = FieldProps["validationState"];
type PBColor = ProgressBarProps["color"];
type ValIcon = FieldProps["validationMessageIcon"];
function getProgressBarProps(creature: Creature): [validationState: ValState, color: PBColor, icon: ValIcon] {
    const hp = creature.hp;
    const hpFull = hp.current >= hp.max;
    const hpCritical = hp.current * 10 <= hp.max; // under 10%
    const dead = hp.current <= 0;
    if (hpFull)
        return ["success", "success", undefined];
    if (dead)
        return ["error", "error", <HeartOffRegular key={`dead-${creature.id}`} />];
    if (hpCritical)
        return ["warning", "warning", undefined];
    return ["none", "brand", <HeartFilled key={`alive-${creature.id}`} color={tokens.colorCompoundBrandBackground} />];
}

interface Props {
    creatures: Creature[];
    activeCreature: Guid | undefined;
    editData: {
        deleteCreature: (creature: Creature) => void;
        updateCreature: (creature: Creature) => void;
    };
}

const useStyles = makeStyles({
    table: {
        width: "100%",
    },
    bar: {
        width: "100%",
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
    actionButtonContainer: {
        display: "flex",
        gap: "0.5rem",
    },
    active: {
        backgroundColor: tokens.colorBrandBackground,
    },
});
const useSharedStyles = sharedStyles();

export default function CreatureGrid({ creatures, activeCreature, editData }: Readonly<Props>) {
    const classes = useStyles();
    const sharedClasses = useSharedStyles();

    const [editingIds, setEditingIds] = useState<Record<string, Creature>>({});

    function isEditing(creature: Creature) {
        return creature.id in editingIds;
    }
    function startEditingCreature(creature: Creature) {
        editCreature(creature, true);
    }
    function editCreature(creature: Creature, shouldClone: boolean = false) {
        if (!shouldClone && !isEditing(creature))
            throw Error("Creature is not being edited");
        setEditingIds({ ...editingIds, [creature.id]: shouldClone ? { ...creature } : creature });
    }
    function stopEditingCreature(creature: Creature) {
        if (!isEditing(creature))
            throw Error("Creature was not being edited");
        setEditingIds(cloneWithout(editingIds, creature.id));
    }
    function saveEditedCreature(creature: Creature) {
        const updated = editingIds[creature.id];
        editData.updateCreature(updated);
        stopEditingCreature(creature);
    }

    function setterInput(id: Guid, property: keyof Creature): InputProps["onChange"] {
        const setCreature = (creature: OptionalNull<Creature>) =>
            isValidCreature(creature) && editCreature(creature);
        return createSetterInput([editingIds[id], setCreature], property);
    }

    function setterSpinButton<K extends keyof Creature>(id: Guid,
        property: K, subProperty?: keyof Creature[K]): SpinButtonProps["onChange"] {
        const setCreature = (creature: OptionalNull<Creature>) =>
            isValidCreature(creature) && editCreature(creature);
        return createSetterSpinButton([editingIds[id], setCreature], property, subProperty);
    }

    const columns: TableColumnDefinition<Creature>[] = [
        createTableColumn<Creature>({
            columnId: ColId.Initiative,
            compare: (a, b) => a.initiative - b.initiative,
            renderHeaderCell: () => <Text title="Initiative">i</Text>,
            renderCell: creature => <TableCellLayout>
                {isEditing(creature)
                    ? <SpinButton
                            // step={1}
                            value={editingIds[creature.id].initiative}
                            onChange={setterSpinButton(creature.id, "initiative")}
                        />
                    : creature.initiative.toString()}
            </TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.Name,
            renderHeaderCell: () => <Text title="Name">name</Text>,
            renderCell: creature => <TableCellLayout appearance="primary">
                {isEditing(creature)
                    ? <Input
                            type="text"
                            value={editingIds[creature.id].name}
                            onChange={setterInput(creature.id, "name")}
                        />
                    : creature.name}
            </TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.HP,
            renderHeaderCell: () => <Text title="HP">hp</Text>,
            renderCell: creature => {
                const [validationState, color, icon] = getProgressBarProps(creature);
                const hp = creature.hp;
                const tempSuffix = hp.temp ? ` (+${hp.temp})` : "";
                return isEditing(creature)
                    ? <div className={mergeClasses(classes.hpInputContainer, classes.hpInputSeparator)}>
                            <SpinButton
                                className={classes.hpInput}
                                step={1}
                                value={editingIds[creature.id].hp.current}
                                onChange={setterSpinButton(creature.id, "hp", "current")}
                                placeholder="current"
                            />
                            <p>/</p>
                            <SpinButton
                                className={classes.hpInput}
                                step={1}
                                value={editingIds[creature.id].hp.max}
                                onChange={setterSpinButton(creature.id, "hp", "max")}
                                placeholder="max"
                            />
                            <p>(+</p>
                            <SpinButton
                                className={classes.hpInput}
                                step={1}
                                value={editingIds[creature.id].hp.temp}
                                onChange={setterSpinButton(creature.id, "hp", "temp")}
                                placeholder="temp"
                            />
                            <p>)</p>
                        </div>
                    : <TableCellLayout content={{ className: classes.bar }}>
                            <Field
                                validationMessage={`${hp.current} / ${hp.max}${tempSuffix}`}
                                validationState={validationState}
                                validationMessageIcon={icon}
                            >
                                <ProgressBar value={hp.current} max={hp.max} color={color} thickness="large" />
                            </Field>
                        </TableCellLayout>;
            },
        }),
        createTableColumn<Creature>({
            columnId: ColId.AC,
            renderHeaderCell: () => <Text title="AC">ac</Text>,
            renderCell: creature => <TableCellLayout>
                {isEditing(creature)
                    ? <SpinButton
                            step={1}
                            value={editingIds[creature.id].ac}
                            onChange={setterSpinButton(creature.id, "ac")}
                        />
                    : creature.ac.toString()}
            </TableCellLayout>,
        }),
        createTableColumn<Creature>({
            columnId: ColId.Actions,
            renderHeaderCell: () => <Text />,
            renderCell: creature => {
                const button = isEditing(creature)
                    ? <div className={classes.actionButtonContainer}>
                            <Button icon={<DismissFilled />} onClick={() => stopEditingCreature(creature)} />
                            <Button icon={<CheckmarkFilled />} onClick={() => saveEditedCreature(creature)}/>
                        </div>
                    : <Menu>
                            <MenuTrigger>
                                <Button icon={<MoreVerticalFilled/>}/>
                            </MenuTrigger>
                            <MenuPopover>
                                <MenuList>
                                    <MenuItem
                                        icon={<EditRegular/>}
                                        onClick={() => startEditingCreature(creature)}
                                    >Edit</MenuItem>
                                    <MenuItem
                                        className={sharedClasses.danger}
                                        icon={<DeleteFilled className={sharedClasses.dangerHover}/>}
                                        onClick={() => editData.deleteCreature(creature)}
                                    >Delete</MenuItem>
                                </MenuList>
                            </MenuPopover>
                        </Menu>;
                return <>
                    <div style={{ flexGrow: 1 }}/>
                    {button}
                </>;
            },
        }),
    ];

    const currentlyEditing = Object.keys(editingIds).length > 0;
    const initAcBaseWidth = 20;
    const initAcWidth = currentlyEditing ? 64 : initAcBaseWidth;
    const nameWidth = 250 + initAcBaseWidth - initAcWidth;
    const colSizes: TableColumnSizingOptions = {
        [ColId.Initiative]: {
            minWidth: initAcWidth,
            idealWidth: initAcWidth,
        },
        [ColId.Name]: {
            autoFitColumns: true,
            idealWidth: nameWidth,
        },
        [ColId.HP]: {
            minWidth: currentlyEditing ? 300 : 100,
            idealWidth: 300,
        },
        [ColId.AC]: {
            minWidth: initAcWidth,
            idealWidth: initAcWidth,
        },
        [ColId.Actions]: {
            minWidth: currentlyEditing ? 72 : 32,
        },
    };

    return (
        <DataGrid
            className={classes.table}
            items={creatures}
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
                {row => {
                    const className = row.item.id == activeCreature ? classes.active : "";
                    return (
                        <DataGridRow<Creature> key={row.rowId} className={className}>
                            {col => (
                                <DataGridCell>{col.renderCell(row.item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    );
                }}
            </DataGridBody>
        </DataGrid>
    );
}
