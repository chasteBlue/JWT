import React, { useState } from 'react'; 
import { Typography, Button, Box } from '@mui/material';
import axios from 'axios';

const ProtectedPage = ({ token, handleLogout }) => {
    const [userData, setUserData] = useState(null);

    const fetchProtectedData = async () => {
        try {
            const response = await axios.get('https://jwt-backend-one.vercel.app/api/protected', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Protected data:', response.data);
            setUserData(response.data); // Store the fetched user data in state
        } catch (error) {
            console.error('Failed to fetch protected data');
        }
    };

    return (
        <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to the Protected Page
            </Typography>
            <Box bgcolor="#f0f0f0" p={2} mb={3} borderRadius={1} sx={{ wordBreak: 'break-all' }}>
                <Typography variant="body2" color='black'>JWT Token: {token}</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={fetchProtectedData} sx={{ mr: 2 }}>
                Fetch Protected Data
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
            {userData && (
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>User Details</Typography>
                    <Typography><strong>First Name:</strong> {userData.fname}</Typography>
                    <Typography><strong>Last Name:</strong> {userData.lname}</Typography>
                    <Typography><strong>Email:</strong> {userData.email}</Typography>
                    <Typography><strong>Contact Number:</strong> {userData.contact_number}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProtectedPage;
