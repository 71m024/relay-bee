import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";
import {useAuth} from "../useAuth.ts";
import {useEnv} from "../environment/useEnv.ts";

export const FETCH_ERROR_UNAUTHORIZED = 'unauthorized'
export const FETCH_ERROR_MISSING_CREDENTIALS = 'missing-credentials'
export type FetchError = {
    name: typeof FETCH_ERROR_UNAUTHORIZED | typeof FETCH_ERROR_MISSING_CREDENTIALS | '%to be added in the future%'
}

export const useRelayEnvironmentCreator = () => {
    const env = useEnv()
    const {getCurrentUser, logout} = useAuth()

    const fetchFn: FetchFunction = async (operation, variables, _cacheConfig, uploadables) => {
        const user = getCurrentUser();
        if (!user) {
            throw new Error(FETCH_ERROR_MISSING_CREDENTIALS)
        }

        const request: RequestInit = {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.token}`
            },
        }

        if (uploadables) {
            if (!window.FormData) {
                throw new Error('Uploading files without `FormData` not supported.')
            }
            const form = new FormData()
            form.append('operations', JSON.stringify({query: operation.text, variables: {file: [null]}}))

            /*
            Could be useful for upload of multiple files
            const map: {[key: string]: Array<string>} = {}
            let i = 0
            Object.values(uploadables).forEach(() => {
                map[i] = ['variables.file.' + i]
                i++
            })*/

            form.append("map", JSON.stringify({0: ['variables.file']}))
            form.append("0", variables.file[0])
            request.body = form
        } else {
            request.headers = {...request.headers, 'Content-Type': 'application/json'}
            request.body = JSON.stringify({
                query: operation.text,
                variables,
            });
        }

        const response = await fetch(`${env?.httpEndpoint}${env?.basePath}/graphql`, request)
        const data = await response.json()
        if (data.code === 401) {
            logout()
            throw new Error(FETCH_ERROR_UNAUTHORIZED)
        }
        return data
    };

    return () => (
        new Environment({
            network: Network.create(fetchFn),
            store: new Store(new RecordSource())
        })
    )
}
