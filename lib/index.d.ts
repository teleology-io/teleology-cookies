export declare const SameSite: {
    STRICT: string;
    LAX: string;
    NONE: string;
};
declare enum Expiry {
    SESSION = "Session"
}
interface Options {
    key: string;
    value: any;
    maxAge?: number;
    expires?: number | Expiry;
    path?: string;
    secure?: boolean;
    urlEncode: boolean;
}
interface ClientOptions extends Options {
}
interface ServerOptions extends Options {
    domain?: string;
    httpOnly?: boolean;
    sameSite?: string;
}
export declare const get: (key: string) => string | undefined;
export declare const set: ({ key, value, maxAge, expires, path, secure, urlEncode }: ClientOptions) => void;
export declare const clear: (key: string) => void;
export declare const header: ({ key, value, maxAge, expires, domain, path, secure, httpOnly, sameSite, urlEncode }: ServerOptions) => string;
export {};
