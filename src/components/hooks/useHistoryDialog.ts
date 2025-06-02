import { Context } from "../context/ContextProvider";

export function useHistoryDialog() {
    const context = Context.HistoryDialog.useValue();

    function showHistoryDialog(details: Prettify<Omit<Extract<typeof context.value, { showing: true }>, "showing">>) {
        context.setValue({
            showing: true,
            ...details,
        });
    }

    return showHistoryDialog;
}
