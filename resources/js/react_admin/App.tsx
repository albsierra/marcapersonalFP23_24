import { useState } from 'react'
import { Admin, Resource, ListGuesser } from "react-admin"
import { authProvider } from './authProvider'
import { dataProvider } from './dataProvider'
import { Login } from './login'
import jsonServerProvider from "ra-data-json-server";

export const App = () => {
    function handleDataProvider(dataProvider) {
        setDataProvider(() => dataProvider)
    }

    const loginPage = <Login handleDataProvider={handleDataProvider} />

    const API_URL = import.meta.env.VITE_JSON_SERVER_URL
    const [dataProvider, setDataProvider] = useState(null)

    if (!dataProvider) {
        handleDataProvider(jsonServerProvider(API_URL))
    }

    return (
        <Admin
            dataProvider={dataProvider}
            authProvider={authProvider}
            loginPage={<Login handleDataProvider={handleDataProvider} />}
            basename="/dashboard"
        >
            <Resource name="users" list={ListGuesser} />
        </Admin>
    );
}
