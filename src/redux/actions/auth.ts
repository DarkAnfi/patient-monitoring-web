import { Dispatch } from 'redux';
import auth from 'redux/types/auth';

export const startLogin = (email: string, password: string): AsyncAction => {
    return async (dispatch: Dispatch) => {
        // dispatch(setLoading(true));
        dispatch(login({
            _id: 'asdasd',
            rut: '19717817',
            name: 'Andrés Flores',
            phone: '+56900000000',
            email: 'example@gmail.com',
        }, 'asdasd'));
    };
};

export const checkingToken = (): AsyncAction => {
    return async (dispatch: Dispatch) => {
        const token = localStorage.getItem('token') || null;
        if (token) {
            dispatch(login({
                _id: 'asdasd',
                rut: '19717817',
                name: 'Andrés Flores',
                phone: '+56900000000',
                email: 'example@gmail.com',
            }, 'asdasd'));
        } else {
            dispatch(logout());
        }
    };
};

export const login = (user: any, token: string): SyncAction => ({
    type: auth.login,
    payload: { user, token },
});

export const logout = (): SyncAction => ({ type: auth.logout });

const setLoading = (value: boolean): SyncAction => ({
    type: auth.setLoading,
    payload: value
});

export const error = (error: AuthError): SyncAction => ({
    type: auth.error,
    payload: error,
});