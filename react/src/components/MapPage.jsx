import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, IconButton, TextField, Box, Button, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnlhdmFyaSIsImEiOiJjbTIzcWhqd2kwOGgxMnNwdTRpZHk4d3AwIn0.BtkK_oWDRBTrWqiGl6qq6w';
const API_BASE_URL = 'http://localhost:3000';

export default function MapPage() {
    const navigate = useNavigate();
    const [viewport, setViewport] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 11,
    });

    const [reports, setReports] = useState([]);
    const [popupInfo, setPopupInfo] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchRadius, setSearchRadius] = useState(5); // Default 5 mile radius

    // Fetch all reports on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    // Fetch reports based on search criteria
    useEffect(() => {
        if (searchInput.trim()) {
            const delayDebounceFn = setTimeout(() => {
                searchReports();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            fetchReports();
        }
    }, [searchInput]);

    const fetchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/reports`);
            setReports(response.data);
        } catch (err) {
            setError('Failed to fetch reports: ' + err.message);
            console.error('Error fetching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const searchReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/reports/search`, {
                params: {
                    speciesName: searchInput,
                    userLat: viewport.latitude,
                    userLon: viewport.longitude,
                    speciesRadius: searchRadius
                }
            });
            setReports(response.data);
        } catch (err) {
            setError('Failed to search reports: ' + err.message);
            console.error('Error searching reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMarkerColor = (species) => {
        // You might want to adjust this based on your species data structure
        const colorMap = {
            'Coyote': 'red',
            'Black Rat': 'black',
            'American Bullfrog': 'green',
            'African Honey Bee': 'yellow'
        };
        return colorMap[species.commonName] || 'gray';
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
                        key={report._id}
                        longitude={report.loc.coordinates[0]}
                        latitude={report.loc.coordinates[1]}
                        color={getMarkerColor(report.species)}
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
                                src={popupInfo.species.picUrl}
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
                                Time: {new Date(popupInfo.createdAt).toLocaleString()}
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
                <Typography variant="h6">Legend</Typography>
                {/* You might want to make this dynamic based on your species data */}
                <Typography variant="body2">🔴 Coyote</Typography>
                <Typography variant="body2">⚫ Black Rat</Typography>
                <Typography variant="body2">🟢 American Bullfrog</Typography>
                <Typography variant="body2">🟡 African Honey Bee</Typography>
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