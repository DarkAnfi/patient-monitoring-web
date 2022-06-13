const LOCAL_API_HTTP = process.env.REACT_APP_LOCAL_API_HTTP || 'http';
const LOCAL_API_HOST = process.env.REACT_APP_LOCAL_API_HOST || 'localhost';
const LOCAL_API_PORT = process.env.REACT_APP_LOCAL_API_PORT;

const DEV_API_HTTP = process.env.REACT_APP_DEV_API_HTTP || 'http';
const DEV_API_HOST = process.env.REACT_APP_DEV_API_HOST || 'localhost';
const DEV_API_PORT = process.env.REACT_APP_DEV_API_PORT;

const PROD_API_HTTP = process.env.REACT_APP_PROD_API_HTTP || 'http';
const PROD_API_HOST = process.env.REACT_APP_PROD_API_HOST || 'localhost';
const PROD_API_PORT = process.env.REACT_APP_PROD_API_PORT || 443;

export const NODE_ENV = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'local';

export const API_HTTP = NODE_ENV === 'production' ? PROD_API_HTTP : NODE_ENV === 'development' ? DEV_API_HTTP : LOCAL_API_HTTP;
export const API_HOST = NODE_ENV === 'production' ? PROD_API_HOST : NODE_ENV === 'development' ? DEV_API_HOST : LOCAL_API_HOST;
export const API_PORT = NODE_ENV === 'production' ? PROD_API_PORT : NODE_ENV === 'development' ? DEV_API_PORT : LOCAL_API_PORT;

export const API_URL = `${API_HTTP}://${API_HOST}${!!API_PORT ? ':' : ''}${API_PORT}/v1`;