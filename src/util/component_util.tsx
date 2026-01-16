import { Avatar, AvatarSize, TableColumnSizingOptions } from "@fluentui/react-components";
import { ColId } from "../constants";

export function makeAvatar(item: NameIcon, size: AvatarSize = 24) {
    return <Avatar icon={item.icon} size={size} />;
}

export function creatureGridColumnSizes(editing: boolean) {
    const initAcBaseWidth = 20;
    const initAcWidth = editing ? 64 : initAcBaseWidth;
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
            minWidth: editing ? 300 : 100,
            idealWidth: 300,
        },
        [ColId.AC]: {
            minWidth: initAcWidth,
            idealWidth: initAcWidth,
        },
        [ColId.Actions]: {
            minWidth: editing ? 72 : 32,
        },
    };
    return colSizes;
}
