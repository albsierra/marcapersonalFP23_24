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

const dataProvider = jsonServerProvider(
    import.meta.env.VITE_JSON_SERVER_URL,
    httpClient
);

const url = `${import.meta.env.VITE_JSON_SERVER_URL}`;

dataProvider.createToken = (email, password) => {
    return httpClient(url + '/tokens', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
};

dataProvider.deleteToken = () => {
    return httpClient(url + '/tokens', {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
};

dataProvider.getIdentity = () => {
    return httpClient(url + '/user', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });
};

export { dataProvider };
