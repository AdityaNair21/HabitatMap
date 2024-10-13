import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <Container>
            <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
                Dashboard Goes Here
            </Typography>

            {/* Button to navigate to the MapPage */}
            <Button
                variant="contained"
                component={Link}
                to="/map"
                sx={{ display: 'block', margin: '20px auto' }}
            >
                Go to Map
            </Button>
        </Container>
    );
}
