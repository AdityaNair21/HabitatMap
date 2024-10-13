import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import the coyote image
import CoyoteImage from './images/coyote.jpg';

const MAPBOX_TOKEN = 'pk.eyJ1IjoicnlhdmFyaSIsImEiOiJjbTIzcWhqd2kwOGgxMnNwdTRpZHk4d3AwIn0.BtkK_oWDRBTrWqiGl6qq6w'; // MapBox access token 

export default function MapPage() {
    const [viewport, setViewport] = useState({
        latitude: 37.7749, // Initial latitude
        longitude: -122.4194, // Initial longitude
        zoom: 10, // Initial zoom level
    });

    // State to manage the popup visibility
    const [popupInfo, setPopupInfo] = useState(null);

    // Marker coordinates
    const markerCoordinates = {
        longitude: -122.4194, // Marker longitude
        latitude: 37.7749, // Marker latitude
    };

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
            <Map
                initialViewState={viewport}
                style={{ width: '500px', height: '500px', marginTop: 2 }} // Adjust to full width
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                onMove={(evt) => setViewport(evt.viewState)}
            >
                {/* Marker */}
                <Marker
                    longitude={markerCoordinates.longitude}
                    latitude={markerCoordinates.latitude}
                    color="red"
                    onClick={() => setPopupInfo(markerCoordinates)} // Show popup on marker click
                >
                </Marker>

                {/* Popup */}
                {popupInfo && (
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        closeButton={true}
                        closeOnClick={false}
                        onClose={() => setPopupInfo(null)} // Close popup when clicking the close button
                        anchor="top" // Position the popup relative to the marker
                        sx={{
                            '& .mapboxgl-popup-content': {
                                padding: 0, // Remove default padding
                                width: '90vw', // Make popup width responsive
                                height: '90vh', // Make popup height responsive
                                maxWidth: '400px', // Optional max width for larger screens
                                borderRadius: '10px',
                                overflow: 'hidden', // Hide overflow to maintain layout
                            },
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column', // Arrange items vertically
                                backgroundColor: '#FFCCCB',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                padding: '10px',
                                height: '100%', // Fill the popup height
                            }}
                        >
                            <img
                                src={CoyoteImage} // Use the imported image
                                alt="Coyote"
                                style={{
                                    width: '100%', // Make image responsive
                                    height: 'auto', // Maintain aspect ratio
                                    borderRadius: '10px', // Rounded corners for the image
                                    marginBottom: '10px', // Spacing below the image
                                }} 
                            />
                            <Typography variant="h6" color="black">
                                Coyote
                            </Typography> {/* Title for the marker */}
                            <Typography variant="body2" color="black" sx={{ marginTop: 1 }}>
                                This is a description of the coyote marker. Here you can provide more details about the marker or related information.
                            </Typography> {/* Description text */}
                            <Typography variant="body2" color="black" sx={{ marginTop: 1 }}>
                                Location: San Francisco, CA
                            </Typography> {/* Additional information */}
                        </div>
                    </Popup>
                )}
            </Map>
        </Container>
    );
}
