import {SortKey, sortKeys} from "./SortKey.ts";
import {transformObjectMap} from "../../../../../util/util.ts";
import {useRouter} from "found";

export type GenericSortingCombination = Record<string, string | null>
export type SortingCombination<T = GenericSortingCombination> = {[p in keyof T]?: SortKey}
export type SortFunction<T = GenericSortingCombination> = (column: keyof T) => (order: SortKey | undefined) => void
type SearchParamsArray = [string, string][]

export const sortingCombinationToQuery
    = (sortingCombination: SortingCombination) => transformObjectMap(sortingCombination, ([c, o]) => [c + 'Order', o])
;

export function useSorting<T>() {
    const {match, router} = useRouter()
    const searchParamArray: SearchParamsArray = Array.from(Object.entries(match.location.query))
    const sortHeader = (key: keyof T) => ({sortKey: key})

    const setQueryParams = (sortingCombination: SortingCombination<T>) => {
        router.replace({
            pathname: match.location.pathname,
            query: sortingCombinationToQuery(sortingCombination)
        })
    }

    const getSortingCombination = (searchParams: SearchParamsArray): SortingCombination<T> => {
        const orderParams = searchParams
            .filter(([k, v]) => k.endsWith('Order') && sortKeys.includes(v as SortKey))
            .map(([c, o]) => [c.split('Order')[0], o])
        ;
        if (orderParams.length) {
            return Object.fromEntries(orderParams)
        }
        return {}
    }

    const sortingCombination = getSortingCombination(searchParamArray)

    const sort: SortFunction<T> = (column: keyof T) => (order: SortKey | undefined) => {
        let newOrderCombination = sortingCombination
        if (order) {
            newOrderCombination = {...sortingCombination, [column]: order}
        } else {
            delete newOrderCombination[column]
        }
        setQueryParams(newOrderCombination)
    }

    const sortingQuery = Object.entries(sortingCombination).map(([c, o]) => ({[c]: o}))
    return {sortingCombination, sortingQuery, sort, sortHeader}
}
