import {Match, RenderProps, RouteConfig, Router} from "found";
import {ComponentType} from "react";
import {GraphQLTaggedNode} from "relay-runtime";
import {FETCH_ERROR_MISSING_CREDENTIALS, FETCH_ERROR_UNAUTHORIZED} from "../relay/useRelayEnvironmentCreator.ts";

export type RBeeRouteObject<VARIABLES> = {
    children?: RouteConfig | Record<string, RouteConfig>
    Component?: ComponentType<unknown>
    path?: string
    query?: GraphQLTaggedNode
    prepareVariables?: (params: Record<string, string>) => VARIABLES
}

export const createRouteConfig = (routeConfig: RBeeRouteObject<unknown>[]): RouteConfig => {
    return routeConfig.map(c => ({
        ...c,
        fetchPolicy: 'store-or-network',
        children: c.children && (Array.isArray(c.children)
                ? createRouteConfig(c.children)
                : Object.fromEntries(Object.entries(c.children).map(([k, v]) => ([k, createRouteConfig(v)])))
        ),
        render: (
            propsObject: {Component?: ComponentType<unknown> | undefined, props?: RenderProps | undefined, match: Match}
        ) => {
            const {Component, props, match} = propsObject
            if ('error' in propsObject && propsObject.error != null) {
                handleError(propsObject.error, match.router)
            } else {
                // @ts-expect-error: we can't know what props the component needs here
                return Component && <Component {...props}/>;
            }
        }
        ,
    }))
}

const handleError = (error: NonNullable<unknown>, router: Router) => {
    if (typeof error == 'object' && 'message' in error) {
        if (error.message === FETCH_ERROR_UNAUTHORIZED ||
            error.message === FETCH_ERROR_MISSING_CREDENTIALS
        ) {
            router.push('/login')
        }
    }
}