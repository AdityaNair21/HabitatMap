import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Alert,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import axios from 'axios';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1E88E5',
        },
        background: {
            default: '#1a1a1a',
            paper: '#1d2634',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
});

const user = JSON.parse(localStorage.getItem('user'));

export default function ProfilePage() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        picUrl: '',
        loc: {
            lat: 0,
            lon: 0
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', severity: 'success' });
    const [showMessage, setShowMessage] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear the user data
        localStorage.removeItem('token'); // Optionally clear the token
        navigate('/login'); // Redirect to the login page
    };

    useEffect(() => {
        // Fetch user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setFormData({
                username: userData.username,
                email: userData.email,
                picUrl: userData.picUrl,
                loc: userData.loc || { lat: 0, lon: 0 }
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            loc: {
                ...prev.loc,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                'http://localhost:3000/updateUser',
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setMessage({
                text: 'Profile updated successfully',
                severity: 'success'
            });
            setShowMessage(true);
        } catch (error) {
            setMessage({
                text: 'Failed to update profile: ' + error.message,
                severity: 'error'
            });
            setShowMessage(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                            {formData.picUrl ? (
                                <Avatar
                                    src={formData.picUrl}
                                    alt={formData.username}
                                    sx={{ width: 100, height: 100, mr: 3 }}
                                />
                            ) : (
                                <Avatar
                                    src={'/images/aditya.JPG'}
                                    alt={user?.username || 'User'}
                                    sx={{ width: 40, height: 40 }}
                                />
                            )}
                            <Typography variant="h4" component="h1">
                                Profile Settings
                            </Typography>
                        </Box>

                        {showMessage && (
                            <Alert
                                severity={message.severity}
                                onClose={() => setShowMessage(false)}
                                sx={{ mb: 3 }}
                            >
                                {message.text}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                margin="normal"
                            />

                            <TextField
                                fullWidth
                                label="Profile Picture URL"
                                name="picUrl"
                                value={formData.picUrl}
                                onChange={handleInputChange}
                                margin="normal"
                            />

                            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Latitude"
                                    name="lat"
                                    type="number"
                                    value={formData.loc.lat || ''}
                                    onChange={handleLocationChange}
                                />
                                <TextField
                                    fullWidth
                                    label="Longitude"
                                    name="lon"
                                    type="number"
                                    value={formData.loc.lon || ''}
                                    onChange={handleLocationChange}
                                />
                            </Box>

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={isLoading}
                                sx={{ mt: 4 }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </form>

                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#FF7F7F' }} // Light red color
                            fullWidth
                            size="large"
                            onClick={handleLogout} // Logout handler
                            sx={{ mt: 4 }}
                        >
                            Logout
                        </Button>
                    </Paper>


                </Container>
            </Box>
        </ThemeProvider>
    );
}