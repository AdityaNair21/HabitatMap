import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Select,
    MenuItem,
    Box,
    Button,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { Upload as UploadIcon, Map as MapIcon } from '@mui/icons-material';
import axios from 'axios';

// Define species data (you can move this to a separate file later)
const speciesList = [
    'Rat',
    'House Mouse',
    'Norway Rat',
    'Black Rat',
    'Desert Rat',
    'Snail',
    'Garden Snail',
    'Giant African Snail',
    'Roman Snail',
    'Grove Snail',
];

const currentUser = {
    userId: "user123",    // Replace with actual user ID from auth
    username: "JohnDoe",  // Replace with actual username from auth
    picUrl: "https://example.com/profile.jpg"  // Replace with actual profile pic
};

const ReportSighting = () => {
    const [formData, setFormData] = useState({
        species: '',
        location: {
            type: 'Point',
            coordinates: [0, 0] // [longitude, latitude]
        },
        description: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour12: false })
    });

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setNotification({ ...notification, open: false });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLocationSelect = async () => {
        // In a real app, you'd integrate with a map selection component
        // For now, we'll use dummy coordinates
        setFormData(prev => ({
            ...prev,
            location: {
                type: 'Point',
                coordinates: [-122.4194, 37.7749] // Example: San Francisco coordinates
            }
        }));
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // In a real app, you'd upload to a cloud storage service
            // For now, we'll use a dummy URL
            setFormData(prev => ({
                ...prev,
                imageUrl: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async () => {
        if (!formData.species || !formData.description) {
            setNotification({
                open: true,
                message: 'Please fill in all required fields',
                severity: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {


            const reportData = {
                user: currentUser,
                species: {
                    speciesId: formData.species || "12345",
                    commonName: "Tiger",
                    scientificName: "Panthera tigris",
                    description: "A large wild cat native to Asia.",
                    picUrl: "https://example.com/species-pic.jpg"
                },
                loc: {
                    type: "Point",
                    coordinates: [3434, 3434] // Correct order: [longitude, latitude]
                },
                description: formData.description,
                picUrl: formData.picUrl
            };

            const response = await axios.post('http://localhost:3000/reports', reportData);

            setNotification({
                open: true,
                message: 'Report submitted successfully!',
                severity: 'success'
            });


            // Reset form
            setFormData({
                species: {
                    speciesId: '',
                    commonName: '',
                    scientificName: '',
                    description: '',
                    picUrl: ''
                },
                loc: {
                    lat: 0,
                    lon: 0
                },
                description: '',
                picUrl: []
            });

        } catch (error) {
            setNotification({
                open: true,
                message: 'Error submitting report: ' + (error.response?.data?.message || error.message),
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Report New Sighting
            </Typography>

            <Select
                fullWidth
                value={formData.species}
                onChange={handleInputChange}
                name="species"
                displayEmpty
                sx={{ mb: 3 }}
            >
                <MenuItem disabled value="">
                    Search Species
                </MenuItem>
                {speciesList.map((species) => (
                    <MenuItem key={species} value={species}>
                        {species}
                    </MenuItem>
                ))}
            </Select>

            <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                >
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </Button>
                <Button
                    variant="contained"
                    startIcon={<MapIcon />}
                    fullWidth
                    onClick={handleLocationSelect}
                >
                    Choose Location
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    type="date"
                    name="date"
                    label="Date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    type="time"
                    name="time"
                    label="Time"
                    value={formData.time}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ReportSighting;