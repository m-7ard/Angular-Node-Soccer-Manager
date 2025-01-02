export default function transformEntries<K extends string, V, R>(obj: Record<K, V>, entryTransformer: (key: K, value: V) => [K, R]): Record<K, R> {
    return Object.entries(obj).reduce(
        (acc, [key, value]) => {
            const [transformedKey, transformedValue] = entryTransformer(key as K, value as V);
            acc[transformedKey] = transformedValue;
            return acc;
        },
        {} as Record<K, R>,
    );
}
