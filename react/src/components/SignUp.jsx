import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    ThemeProvider,
    createTheme,
    CircularProgress,
    Alert,
    Avatar,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';

const OPENCAGE_API_KEY = "b50efeef55dc49b78813357c994656c1";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#1E88E5' },
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

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        picUrl: '',
        loc: { lat: null, lon: null }
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 2) {
            newErrors.password = 'Password must be at least 2 characters';
        } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.address) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);

            // Create a preview for the UI
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const geocodeAddress = async (address) => {
        try {
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}`
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                return { lat, lon: lng };
            }
            throw new Error('Address not found');
        } catch (error) {
            console.error('Geocoding error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // First, geocode the address
            const coordinates = await geocodeAddress(formData.address);

            // Create FormData object to send file and other data
            const formDataToSend = new FormData();
            if (selectedFile) {
                formDataToSend.append('profilePicture', selectedFile);
            }
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('loc', JSON.stringify(coordinates));
            formDataToSend.append('pinnedSpecies', JSON.stringify([]));

            // Send the form data to the server
            const response = await axios.post('http://localhost:3000/createUser',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 201) {
                navigate('/login');
            } else {
                throw new Error('Failed to create account');
            }
        } catch (error) {
            setServerError(error.response?.data?.error || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    p: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 400,
                        background: 'linear-gradient(145deg, #1d2634 0%, #1a237e 100%)',
                    }}
                >
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Sign Up
                    </Typography>

                    {serverError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {serverError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Profile Picture Upload */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={previewImage}
                                    sx={{ width: 100, height: 100 }}
                                />
                                <IconButton
                                    color="primary"
                                    aria-label="upload picture"
                                    component="label"
                                    sx={{
                                        position: 'absolute',
                                        bottom: -10,
                                        right: -10,
                                        bgcolor: 'background.paper'
                                    }}
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleImageUpload}
                                    />
                                    <PhotoCamera />
                                </IconButton>
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            name="username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            error={!!errors.username}
                            helperText={errors.username}
                        />

                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={!!errors.email}
                            helperText={errors.email}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={!!errors.password}
                            helperText={errors.password}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />

                        <TextField
                            fullWidth
                            label="Address"
                            variant="outlined"
                            margin="normal"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            error={!!errors.address}
                            helperText={errors.address}
                            placeholder="Enter your full address"
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                        </Button>

                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none' }}
                        >
                            Already have an account? Login
                        </Button>
                    </form>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}