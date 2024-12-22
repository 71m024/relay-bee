import {
    FETCH_ERROR_MISSING_CREDENTIALS,
    FETCH_ERROR_UNAUTHORIZED,
    FetchError
} from "../../util/relay/useRelayEnvironmentCreator.ts";
import {useRouter} from "found";
import {LoginForm} from "../LoginForm.tsx";

type Props = { error: Error & FetchError, resetErrorBoundary: () => void};

export function ErrorFallback({ error, resetErrorBoundary }: Props) {
    const {router} = useRouter();
    if (error.message === FETCH_ERROR_UNAUTHORIZED || error.message === FETCH_ERROR_MISSING_CREDENTIALS) {
        return (
            <div className="m-8">
                <h2 className="text-blue-500 font-bold text-2xl mb-4">Sitzung abgelaufen</h2>
                <LoginForm onSuccess={() => router.go(0)}/>
            </div>
        )
    }
    return (
        <div role="alert" className="m-8">
            <div className="flex flex-col gap-4">
                <h2 className="text-red-500 font-bold text-2xl">{error.name}</h2>
                <p className="text-red-500">{error.message}</p>
                <pre className="text-red-500 overflow-scroll">{error.stack}</pre>
                <button
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={resetErrorBoundary}>Retry
                </button>
            </div>
        </div>
    );
}
