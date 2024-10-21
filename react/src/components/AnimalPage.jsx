import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

export default function AnimalPage() {
    // Get the animal ID (name) from the URL parameter
    const { id } = useParams();

    // Capitalize the first letter of the animal name (optional)
    const animalName = id.charAt(0).toUpperCase() + id.slice(1);

    return (
        <Container>
            <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
                {animalName} page goes here
            </Typography>
        </Container>
        //testing
    );
}
