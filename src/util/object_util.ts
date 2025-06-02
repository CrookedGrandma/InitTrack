export function cloneWithout<T extends AnyObject>(obj: T, key: keyof T): Omit<T, keyof T> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used to remove the key from the object
    return (({ [key]: _, ...rest }) => rest)(obj);
}

export function cloneWithUpdated<T extends AnyObject, K extends keyof T>(obj: T, key: K, value: T[K]): T {
    return { ...obj, [key]: value };
}

export function distinctBy<T, K extends keyof T>(array: T[], key: K): T[] {
    return array.filter((item, index) => array.findIndex(i => i[key] === item[key]) === index);
}
