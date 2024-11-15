import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, ThemeProvider, createTheme, CssBaseline, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ProtectedPage from './Auth/ProtectedPage';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setIsAuthenticated(true);
            setToken(savedToken);
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://jwt-backend-one.vercel.app/api/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setToken('');
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center' }}>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/protected" />
                                ) : (
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            backgroundColor: 'background.paper',
                                            p: 4,
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            width: '100%',
                                        }}
                                    >
                                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', mx: 'auto' }}>
                                            <LockOutlinedIcon />
                                        </Avatar>
                                        <Typography variant="h5" gutterBottom>
                                            Login
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Using JWT Authentication
                                        </Typography>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            margin="normal"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <TextField
                                            label="Password"
                                            type="password"
                                            fullWidth
                                            margin="normal"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
                                            Login
                                        </Button>
                                    </Box>
                                )
                            }
                        />
                        <Route
                            path="/protected"
                            element={
                                isAuthenticated ? (
                                    <ProtectedPage token={token} handleLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/"
                            element={
                                isAuthenticated ? (
                                    <Navigate to="/protected" />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App;
