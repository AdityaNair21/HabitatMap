import React, { useState } from 'react';
import { Container, Typography, Paper, IconButton, TextField, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom


const speciesData = [
    { id: 1, type: "Mammal", name: "Coyote", image: "/images/coyote.jpg" },
    { id: 2, type: "Mammal", name: "Black Rat", image: "/images/blackrat.jpg" },
    { id: 3, type: "Amphibian", name: "American Bullfrog", image: "/images/americanbullfrog.jpg" },
    { id: 4, type: "Insect", name: "African Honey Bee", image: "/images/africanhoneybee.jpg" }
];

const reportData = [
    { id: 1, timestamp: '2024-10-14T12:00:00Z', species_id: 1, loc: { lat: 37.7749, lon: -122.4194 }, description: "Coyote spotted in the park." },
    { id: 2, timestamp: '2024-10-14T12:30:00Z', species_id: 2, loc: { lat: 37.7849, lon: -122.4294 }, description: "Black rat spotted near garbage bins." },
    { id: 3, timestamp: '2024-10-14T13:00:00Z', species_id: 3, loc: { lat: 37.7649, lon: -122.4394 }, description: "American bullfrog near the lake." },
    { id: 4, timestamp: '2024-10-14T14:00:00Z', species_id: 4, loc: { lat: 37.7740, lon: -122.4290 }, description: "African honey bee colony in the park." }
];

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnlhdmFyaSIsImEiOiJjbTIzcWhqd2kwOGgxMnNwdTRpZHk4d3AwIn0.BtkK_oWDRBTrWqiGl6qq6w'; // MapBox access token 

export default function MapPage() {
    const navigate = useNavigate(); // Use the hook for navigation
    const [viewport, setViewport] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 11,
    });

    const [popupInfo, setPopupInfo] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const getSpeciesById = (id) => speciesData.find(species => species.id === id);

    const filteredReports = reportData.filter(report =>
        report.description.toLowerCase().includes(searchInput.toLowerCase())
    );

    return (
        <Box sx={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
            
            
            {/* Floating Header */}
            <Box
                sx={{
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
                }}
            >
                <Typography variant="h5" fontWeight="bold">HabitatMap</Typography>
            </Box>


            {/* Separate Floating Button at Top Right */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20, // Position the button at the top-right
                    zIndex: 1,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 255)',
                        },
                        textTransform: 'none',
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* Floating Centered Search Bar */}
<Box sx={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
    <TextField
        variant="outlined"
        placeholder="Search sightings..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        sx={{
            width: '400px',
            backgroundColor: 'rgba(30, 30, 30, 0.8)',  // Same transparent background as legend and logo
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'transparent' },  // No border
                '&:hover fieldset': { borderColor: 'transparent' },  // No border on hover
                '&.Mui-focused fieldset': { borderColor: 'white' },  // White border when focused
            },
            '& .MuiInputBase-input': {
                color: 'white',  // White text color
                padding: '10px',  // Add some padding for better visual
            },
            '& .MuiInputAdornment-root': {
                color: 'white',  // Ensure placeholder and input text are visible
            }
        }}
    />
</Box>


            {/* Map with Markers */}
            <Map
                initialViewState={viewport}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={(evt) => setViewport(evt.viewState)}
            >
                {filteredReports.map(report => {
                    const species = getSpeciesById(report.species_id);
                    let markerColor = "red"; // Default color for Coyote

                    // Assign colors for each species
                    if (species.name === "Black Rat") markerColor = "black";
                    else if (species.name === "American Bullfrog") markerColor = "green";
                    else if (species.name === "African Honey Bee") markerColor = "yellow";

                    return (
                        <Marker
                            key={report.id}
                            longitude={report.loc.lon}
                            latitude={report.loc.lat}
                            color={markerColor}
                            onClick={() => setPopupInfo(report)}
                        />
                    );
                })}

                {/* Popup */}
                {popupInfo && (
    <Popup
        longitude={popupInfo.loc.lon}
        latitude={popupInfo.loc.lat}
        anchor="top"
        onClose={() => setPopupInfo(null)}
        closeOnClick={false}
        offset={20}
    >
        <Box sx={{ width: '250px', padding: 2, backgroundColor: 'rgba(30, 30, 30, 0.9)', borderRadius: '8px', position: 'relative' }}>
            {/* Close Button */}
            <IconButton
                onClick={() => setPopupInfo(null)}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    zIndex: 2, // Ensure the button is above other content in the popup
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Popup Content */}
            <Typography variant="h6" sx={{ color: 'white' }}>
                {getSpeciesById(popupInfo.species_id).name}
            </Typography>
            <img
                src={getSpeciesById(popupInfo.species_id).image}
                alt={getSpeciesById(popupInfo.species_id).name}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
            />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {popupInfo.description}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Time: {new Date(popupInfo.timestamp).toLocaleString()}
            </Typography>
        </Box>
    </Popup>
)}
            </Map>

            {/* Darker Legends Tab */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    zIndex: 1,
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    color: 'white',
                    padding: 2,
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                    maxWidth: '220px'
                }}
            >
                <Typography variant="h6" sx={{ color: 'white' }}>Legend</Typography>
                <Typography variant="body2">🔴 Coyote Sighting</Typography>
                <Typography variant="body2" color="white">⚫ Black Rat Sighting</Typography>
                <Typography variant="body2" color="lightgreen">🟢 American Bullfrog Sighting</Typography>
                <Typography variant="body2" color="yellow">🟡 African Honey Bee Sighting</Typography>
            </Box>

            {/* Footer Branding */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    fontSize: '0.75rem'
                }}
            >
                <Typography variant="caption">© 2024 HabitatMap</Typography>
            </Box>
        </Box>
    );
}
