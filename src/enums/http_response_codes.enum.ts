
export enum Success{
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202
}

export enum ClientError{
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404
}

export enum ServerError{
    INTERNAL_SERVER_ERROR = 500
}