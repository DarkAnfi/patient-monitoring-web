import { useCallback, useEffect, useReducer } from 'react';
import { fetchWithToken, fetchWithoutToken } from 'utils/fetch';

interface UseFetchProps {
    endpoint: string;
    fetchManually: boolean;
    withToken: boolean;
    method?: string;
    body?: any;
}

const useFetch = ({ endpoint, fetchManually = false, withToken = true, method = 'GET', body }: UseFetchProps) => {

    const [state, dispatch] = useReducer(fetchReducer, {
        isLoading: false,
        isError: false,
        error: null,
        data: null,
    });

    const { isLoading, isError, error, data } = state;

    const fetchData = useCallback(
        async (didCancel: boolean = false) => {
            dispatch({ type: 'INIT' });
            try {
                let result: any = null;
                if (withToken) result = await fetchWithToken(endpoint, body, method);
                else result = await fetchWithoutToken(endpoint, body, method);
                if (!didCancel) {
                    if (result.ok) dispatch({ type: 'SUCCESS', payload: result.data });
                    else dispatch({ type: 'FAILURE', payload: result.message });
                }
            } catch (error) {
                console.warn(error);
                if (!didCancel) {
                    dispatch({ type: 'FAILURE', payload: error.message });
                }
            }
        },
        [dispatch, fetchWithToken, fetchWithoutToken, body, endpoint, method, withToken],
    );

    useEffect(() => {
        let didCancel = false;
        if (!fetchManually) {
            fetchData(didCancel);
        }
        return () => {
            didCancel = true;
        };
    }, [endpoint, fetchData, fetchManually]);

    return { isLoading, isError, error, data, fetchData };
};

interface FetchState {
    isLoading: boolean;
    isError: boolean;
    error?: any;
    data?: any;
}

const fetchReducer = (state: FetchState, { type, payload }: SyncAction) => {
    switch (type) {
        case 'INIT':
            return {
                ...state,
                isLoading: false,
                isError: false,
                error: null,
            };
        case 'SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                error: null,
                data: payload,
            };
        case 'FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                error: payload,
            };
        default:
            return state;
    }
};

export default useFetch;