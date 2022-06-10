import { Reducer } from 'redux';
import auth from 'redux/types/auth';

const initialState = {
    user: null,
    checking: true,
    token: null,
    isLoading: false,
    error: {
        type: null,
        message: null,
    },
};

export const authReducer: Reducer<AuthState, SyncAction> = (state = initialState, { type, payload }): AuthState => {
    switch (type) {
        case auth.login:
            return {
                ...state,
                user: payload.user,
                token: payload.token,
                checking: false,
                error: {
                    type: null,
                    message: null,
                },
            };
        case auth.logout:
            return {
                ...state,
                user: null,
                token: null,
                checking: false,
                error: {
                    type: null,
                    message: null,
                },
            };
        case auth.error:
            return {
                ...state,
                error: payload,
                user: null,
                token: null,
                checking: false,
            };
        case auth.setLoading:
            return {
                ...state,
                isLoading: payload,
            };
        default:
            return state;
    }
};