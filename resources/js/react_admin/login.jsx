import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Button } from 'react-admin';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const handleDataProvider = props.handleDataProvider

    const handleSubmit = e => {
        e.preventDefault();
        // will call authProvider.login({ email, password })
        login({ email, password, handleDataProvider }).catch(() =>
            notify('Invalid email or password')
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <Button type="submit" color="primary" variant="contained">
                Sign In
            </Button>
        </form>
    );
};
