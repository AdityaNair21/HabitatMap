import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import mockData from './mockData.json';

export default function AnimalsPage() {
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Animal Index
            </Typography>
            <Grid container spacing={4}>
                {mockData.map((animal) => (
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
