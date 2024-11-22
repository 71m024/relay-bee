export type ExtractNodeFromEdges<
    T extends {
        readonly edges: readonly ({readonly node: unknown} | undefined | null)[] | undefined | null
    } | undefined | null
>
    = NonNullable<NonNullable<NonNullable<NonNullable<T>['edges']>[number]>['node']>
;

export const transformObjectMap = <INPUT extends {[key: string]: INPUT[KEY]}, OUTPUT, KEY extends keyof INPUT>(
    mapping: INPUT, transformer: (input: [string, INPUT[KEY]]) => [string, OUTPUT]
): { [key: string]: OUTPUT } =>
    Object.fromEntries(Object.entries(mapping).map(transformer))
;

export const nameToId = (name: string): string => name.toLowerCase()
    .replace(' ', '-')
    .replace('ä', 'ae')
    .replace('ö', 'oe')
    .replace('ü', 'ue')
;

export const backendPath = (path: string): string =>
    import.meta.env.VITE_HTTP_ENDPOINT + path
;