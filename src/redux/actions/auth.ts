import { Dispatch } from 'redux';
import auth from 'redux/types/auth';

export const startLogin = (email: string, password: string): AsyncAction => {
    return async (dispatch: Dispatch) => {
        // dispatch(setLoading(true));
        // dispatch({
        //     type: 'socket',
        //     promise: (client: SocketService): Promise<Dict> => client.emit<Dict>('login', [email, password]).then(data => {
        //         dispatch(login(data.user, data.token));
        //         return data;
        //     }).catch((reason: any) => {
        //         dispatch(error({
        //             type: 'error',
        //             message: 'Error al ingresar sesión. Por favor verifique su conexión e intente nuevamente'
        //         }));
        //         return reason;
        //     }).finally(() => {
        //         dispatch(setLoading(false));
        //     }),
        // });
    };
};

export const checkingToken = (): AsyncAction => {
    return async (dispatch: Dispatch) => {
        // const token = localStorage.getItem('token') || null;
        // if (token) {
        //     dispatch({
        //         type: 'socket',
        //         promise: (client: SocketService): Promise<Dict> => client.emit<Dict>('renew_token', [token]).then(data => {
        //             dispatch(login(data.user, data.token));
        //             return data;
        //         }).catch((reason: any) => {
        //             dispatch(logout());
        //             return reason;
        //         }),
        //     });
        // } else {
        //     dispatch(logout());
        // }
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