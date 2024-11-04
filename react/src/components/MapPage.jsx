import React, { useState } from 'react';
import { Container, Typography, Paper, IconButton, TextField, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import the coyote image for demonstration purposes
import CoyoteImage from './images/coyote.jpg'; // Replace with require if images are dynamic

// JSON data for species and reports
const speciesData = [
    { id: 1, type: "Mammal", name: "Coyote", image: CoyoteImage }
];

// Extend the reportData with multiple coyote sightings
const reportData = [
    { id: 1, timestamp: '2024-10-14T12:00:00Z', species_id: 1, loc: { lat: 37.7749, lon: -122.4194 }, description: "Coyote spotted in the park." },
    { id: 2, timestamp: '2024-10-14T12:30:00Z', species_id: 1, loc: { lat: 37.7849, lon: -122.4294 }, description: "Coyote sighting near the lake." },
    { id: 3, timestamp: '2024-10-14T13:00:00Z', species_id: 1, loc: { lat: 37.7649, lon: -122.4394 }, description: "Coyote spotted in the residential area." },
    // Add more sightings as needed
];

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnlhdmFyaSIsImEiOiJjbTIzcWhqd2kwOGgxMnNwdTRpZHk4d3AwIn0.BtkK_oWDRBTrWqiGl6qq6w'; // MapBox access token 

export default function MapPage() {
    const [viewport, setViewport] = useState({
        latitude: 37.7749, // Initial latitude
        longitude: -122.4194, // Initial longitude
        zoom: 10, // Initial zoom level
    });

    // State to manage the popup visibility
    const [popupInfo, setPopupInfo] = useState(null);

    // State to manage the search input
    const [searchInput, setSearchInput] = useState("");

    // Fetch species details by ID
    const getSpeciesById = (id) => {
        return speciesData.find(species => species.id === id);
    };

    // Custom popup component
    const PopupComponent = ({ report, onClose }) => {
        const species = getSpeciesById(report.species_id);
        return (
            <Paper
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '24px',
                    width: '400px',
                    backgroundColor: '#C0C0C0',
                    borderRadius: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                <IconButton
                    style={{ position: 'absolute', right: 0, top: 0 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
                <img
                    src={species.image}
                    alt={species.name}
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '15px',
                        marginBottom: '15px',
                    }}
                />
                <Typography variant="h6" color="black">
                    {species.name}
                </Typography>
                <Typography variant="body2" color="black" sx={{ marginTop: 1 }}>
                    {report.description}
                </Typography>
                <Typography variant="body2" color="black" sx={{ marginTop: 1 }}>
                    Location: Latitude {report.loc.lat}, Longitude {report.loc.lon}
                </Typography>
                <Typography variant="body2" color="black" sx={{ marginTop: 1 }}>
                    Time: {new Date(report.timestamp).toLocaleString()}
                </Typography>
            </Paper>
        );
    };

    // Filter reports based on the search input
    const filteredReports = reportData.filter(report =>
        report.description.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
                HabitatMap
            </Typography>

            {/* Search Bar */}
            <TextField
                variant="outlined"
                label="Search Reports"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                    marginBottom: 2,
                    width: '300px',
                    '& .MuiInputLabel-root': {
                        color: 'white', // Label color
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Border color
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Border color when focused
                        },
                        '& input': {
                            color: 'white', // Input text color
                        },
                    },
                }}
            />


            <Map
                initialViewState={viewport}
                style={{ width: '500px', height: '500px', marginTop: 2 }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={(evt) => setViewport(evt.viewState)}
            >
                {/* Map over filtered report data to create markers */}
                {filteredReports.map((report) => (
                    <Marker
                        key={report.id}
                        longitude={report.loc.lon}
                        latitude={report.loc.lat}
                        color="red"
                        onClick={() => setPopupInfo(report)} // Show popup on marker click
                    />
                ))}
            </Map>

            {/* Custom Popup */}
            {popupInfo && (
                <PopupComponent report={popupInfo} onClose={() => setPopupInfo(null)} />
            )}

            {/* Legend */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    padding: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
            >
                <Typography variant="h6">Legend</Typography>
                <Typography variant="body2">🔴 Coyote Sighting</Typography>
                {/* Add more legend items as needed */}
            </Box>
        </Container>
    );
}
