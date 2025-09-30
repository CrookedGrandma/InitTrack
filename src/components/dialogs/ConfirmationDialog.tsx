import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { DeleteRegular } from "@fluentui/react-icons";

interface Props {
    btnLabel: string;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export default function ConfirmationDialog({ btnLabel, title, message, onConfirm, onCancel }: Readonly<Props>) {
    return (
        <Dialog>
            <DialogTrigger>
                <Button icon={<DeleteRegular />}>{btnLabel}</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{message}</DialogContent>
                    <DialogActions>
                        <DialogTrigger>
                            <Button onClick={onConfirm} appearance="primary">Yes</Button>
                        </DialogTrigger>
                        <DialogTrigger>
                            <Button onClick={onCancel} appearance="secondary">No</Button>
                        </DialogTrigger>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
