import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, Box } from '@mui/material';
import mockData from './mockData.json';

export default function AnimalPage() {
    const { id } = useParams(); 
    const animal = mockData.find(a => a.speciesId === Number(id)); 

    if (!animal) {
        return (
            <Container sx={{ marginTop: 4 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Animal not found
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                {animal.commonName} 
            </Typography>
            <Box sx={{ marginBottom: 4 }}>
                <Card>
                    <CardMedia
                        component="img"
                        height="140"
                        image={animal.picUrl || "https://via.placeholder.com/150"} 
                        alt={animal.commonName}
                    />
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {animal.commonName}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {animal.scientificName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {animal.description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
