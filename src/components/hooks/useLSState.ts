import useLocalStorageState, { LocalStorageOptions, LocalStorageState } from "use-local-storage-state";

export function useLSState<T>(key: string, defaultValue: T,
    options: Omit<LocalStorageOptions<T>, "defaultValue"> = {}): LocalStorageState<T> {
    return useLocalStorageState<T>(`inittrack-${key}`, { ...options, defaultValue });
}
