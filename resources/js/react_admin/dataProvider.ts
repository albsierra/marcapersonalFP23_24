import { fetchUtils } from 'react-admin';
import jsonServerProvider from "ra-data-json-server";

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) : undefined
    if (token) {
        options.headers.set('Authorization', `${token.token_type} ${token.access_token}`);
    }
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL,
    httpClient
);
