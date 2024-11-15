import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://jwt-backend-one.vercel.app/auth/login', { email });
            localStorage.setItem('token', response.data.token);
            alert('Logged in successfully');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
