import React, { useState, useEffect } from 'react';
import { Typography, IconButton, TextField, Box, Button, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MapPage() {
    const navigate = useNavigate();
    const REFRESH_INTERVAL = 1000; // 1 second refresh

    const [viewport, setViewport] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 11,
    });

    const [reports, setReports] = useState([]);
    const [uniqueSpecies, setUniqueSpecies] = useState([]);
    const [popupInfo, setPopupInfo] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchRadius, setSearchRadius] = useState(5);

    const getMarkerColor = (speciesName) => {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF', '#FF33F5', 
            '#33FFF5', '#FFB533', '#B533FF', '#FF3333', 
            '#33FFB5', '#5733FF',
        ];
        
        const hash = speciesName.split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        return colors[hash % colors.length];
    };

    // Auto-refresh effect
    useEffect(() => {
        // Initial fetch
        fetchReports();

        // Set up interval for periodic refresh
        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                if (!searchInput.trim()) {
                    fetchReports();
                } else {
                    searchReports();
                }
            }
        }, REFRESH_INTERVAL);

        // Visibility change handler
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (!searchInput.trim()) {
                    fetchReports();
                } else {
                    searchReports();
                }
            }
        };

        // Add visibility change listener
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [searchInput]); // Added searchInput as dependency

    // Search effect
    useEffect(() => {
        if (searchInput.trim()) {
            const delayDebounceFn = setTimeout(() => {
                searchReports();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        }
    }, [searchInput]);

    const fetchReports = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports`);
            
            // Only update state if data has changed
            if (JSON.stringify(response.data) !== JSON.stringify(reports)) {
                setReports(response.data);
                
                // Extract unique species from reports
                const species = [...new Set(response.data.map(report => 
                    report.species.commonName
                ))];
                setUniqueSpecies(species);
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            if (!reports.length) {
                setError('Failed to fetch reports: ' + err.message);
            }
        }
    };

    const searchReports = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/search`, {
                params: {
                    speciesName: searchInput,
                    userLat: viewport.latitude,
                    userLon: viewport.longitude,
                    speciesRadius: searchRadius
                }
            });
            
            // Only update state if data has changed
            if (JSON.stringify(response.data) !== JSON.stringify(reports)) {
                setReports(response.data);
                
                // Update unique species for filtered results
                const species = [...new Set(response.data.map(report => 
                    report.species.commonName
                ))];
                setUniqueSpecies(species);
            }
        } catch (err) {
            console.error('Error searching reports:', err);
            if (!reports.length) {
                setError('Failed to search reports: ' + err.message);
            }
        }
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                zIndex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h5" fontWeight="bold">HabitatMap</Typography>
            </Box>

            {/* Back Button */}
            <Box sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 1,
            }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                        },
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* Search Bar */}
            <Box sx={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
                width: '400px'
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search species..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    sx={{
                        backgroundColor: 'rgba(30, 30, 30, 0.8)',
                        borderRadius: '8px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'transparent' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                            padding: '10px',
                        }
                    }}
                />
            </Box>

            {/* Error Message */}
            {error && (
                <Box sx={{
                    position: 'absolute',
                    top: 80,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1,
                    width: '80%',
                    maxWidth: '600px'
                }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Loading Indicator */}
            {loading && (
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Map */}
            <Map
                initialViewState={viewport}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={(evt) => setViewport(evt.viewState)}
            >
                {reports.map((report) => (
                    <Marker
                        key={report.species.speciesId}
                        longitude={report.loc.coordinates[0]}
                        latitude={report.loc.coordinates[1]}
                        color={getMarkerColor(report.species.commonName)}
                        onClick={() => setPopupInfo(report)}
                    />
                ))}

                {popupInfo && (
                    <Popup
                        longitude={popupInfo.loc.coordinates[0]}
                        latitude={popupInfo.loc.coordinates[1]}
                        anchor="top"
                        onClose={() => setPopupInfo(null)}
                        closeOnClick={false}
                        offset={20}
                    >
                        <Box sx={{
                            width: '250px',
                            padding: 2,
                            backgroundColor: 'rgba(30, 30, 30, 0.9)',
                            borderRadius: '8px',
                            position: 'relative'
                        }}>
                            <IconButton
                                onClick={() => setPopupInfo(null)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: 'white'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Typography variant="h6" sx={{ color: 'white' }}>
                                {popupInfo.species.commonName}
                            </Typography>
                            <img
                                src={popupInfo.picUrl[0]} 
                                alt={popupInfo.species.commonName}
                                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
                            />
                            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {popupInfo.description}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                Reported by: {popupInfo.user.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                                Reported on: {new Date(popupInfo.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                    </Popup>
                )}
            </Map>

            {/* Legend */}
            <Box sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 1,
                backgroundColor: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                padding: 2,
                borderRadius: '8px',
                maxWidth: '220px'
            }}>
                <Typography variant="h6" gutterBottom>Legend</Typography>
                <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    {uniqueSpecies.map((speciesName) => (
                        <Box 
                            key={speciesName} 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                mb: 1
                            }}
                        >
                            <Box 
                                sx={{ 
                                    width: 12, 
                                    height: 12, 
                                    borderRadius: '50%', 
                                    backgroundColor: getMarkerColor(speciesName)
                                }} 
                            />
                            <Typography variant="body2">
                                {speciesName}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '5px'
            }}>
                <Typography variant="caption">© 2024 HabitatMap</Typography>
            </Box>
        </Box>
    );
}