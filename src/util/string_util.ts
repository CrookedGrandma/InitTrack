export function joinCommaAnd(arr: string[], useAmp: boolean = true): string {
    if (arr.length === 0)
        return "";
    if (arr.length === 1)
        return arr[0];
    const and = useAmp ? "&" : "and";
    return `${arr.slice(0, -1).join(", ")} ${and} ${arr.pop()}`;
}
