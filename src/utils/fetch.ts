import * as Config from 'config/config';
import { Success, ClientError, ServerError } from '../enums/http_response_codes.enum';

interface Result {
    _code?: Success | ClientError | ServerError;
    ok: boolean;
    message: string;
    data?: any;
}

const fetchWithoutToken = async (endpoint: string, data?: any, method: string = 'GET'): Promise<Result> => {
    const url = `${Config.API_URL}/${endpoint}`;

    if (method === 'GET') {
        const resp: Response = await fetch(url, {
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
        return await resp.json();
    } else {
        const resp: Response = await fetch(url, {
            method,
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data),
        });
        return await resp.json();
    }
};

const fetchWithToken = async (endpoint: string, data = {}, method: string = 'GET'): Promise<Result> => {
    const url = `${Config.API_URL}/${endpoint}`;
    const token = localStorage.getItem('token') || '';
    if (method === 'GET') {
        const resp: Response = await fetch(url, {
            method,
            mode: 'cors',
            headers: {
                'token': token,
                'Access-Control-Allow-Origin': '*',
            },
        });
        return await resp.json();
    } else {
        const resp: Response = await fetch(url, {
            method,
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                'token': token,
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data)
        });
        return await resp.json();
    }
};

export {
    fetchWithoutToken,
    fetchWithToken,
};
