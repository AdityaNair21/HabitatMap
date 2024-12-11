import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, TextField, Box } from '@mui/material';
import mockData from './mockData.json';

export default function AnimalsPage() {

    const [searchQuery, setSearchQuery] = useState('');
    const [animals, setAnimals] = useState([]);

    const fetchAnimals = async (query) => {
        try {
            const response = await fetch(`/api/animals?search=${query}`);
            const data = await response.json();
            setAnimals(data);
        } catch (error) {
            console.error('Error fetching animals:', error);
        }
    };

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchAnimals(query); // Trigger the backend search
    };
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Animal Index
            </Typography>
            <Box mb={4}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search animals..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>
            <Grid container spacing={4}>
                {animals.map((animal) => (
                    <Grid item xs={12} sm={6} md={4} key={animal.speciesId}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={animal.picUrl || "https://via.placeholder.com/150"} 
                                alt={animal.commonName}
                            />
                            <CardContent>
                                <Typography variant="h6">
                                    <Link to={`/animal/${animal.speciesId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {animal.commonName}
                                    </Link>
                                </Typography>
                                <Typography variant="subtitle2" color="textSecondary">
                                    {animal.scientificName}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}