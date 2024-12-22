import {useRelayEnvironmentCreator} from "./useRelayEnvironmentCreator.ts";
import {RelayEnvironmentProvider} from "react-relay";
import {ReactNode} from "react";
import {PeerRelayEnvContext} from "./usePeerRelayEnv.ts";

export const PeerRelayEnvironmentProvider = ({children}: {children: ReactNode}) => {
    const relayEnvironment = useRelayEnvironmentCreator()()
    return (
        <RelayEnvironmentProvider environment={relayEnvironment}>
            <PeerRelayEnvContext.Provider value={relayEnvironment}>
                {children}
            </PeerRelayEnvContext.Provider>
        </RelayEnvironmentProvider>
    )
}
