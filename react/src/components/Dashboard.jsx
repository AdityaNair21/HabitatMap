import ReportSighting from './ReportSighting';

import React from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardMedia,
    Select,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { Upload as UploadIcon, Map as MapIcon } from '@mui/icons-material';

// Create custom theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1E88E5',
        },
        background: {
            default: '#1a1a1a',
            paper: '#212121',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1d2634',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1d2634',
                    borderRadius: 8,
                },
            },
        },
    },
});

const dummySpecies = [
    'Rat',
    'House Mouse',
    'Norway Rat',
    'Black Rat',
    'Desert Rat',
    'Snail',
    'Garden Snail',
    'Giant African Snail',
    'Roman Snail',
    'Grove Snail',
];

const pinnedAnimals = [
    {
        name: 'Snail Egg Cluster',
        sightings: 16,
        percentage: 15,
        image: '/path/to/snail-egg.jpg',
        location: 'Urban Gardens'
    },
    {
        name: 'Scary Rat',
        sightings: 3,
        percentage: 5,
        image: '/path/to/rat.jpg',
        location: 'Downtown Area'
    }
];

const popularAnimals = [
    {
        name: 'Garden Snail',
        sightings: 24,
        percentage: 20,
        image: '/path/to/garden-snail.jpg',
        location: 'Suburban Areas'
    },
    {
        name: 'House Mouse',
        sightings: 18,
        percentage: 12,
        image: '/path/to/house-mouse.jpg',
        location: 'Residential Zones'
    },
    {
        name: 'Norway Rat',
        sightings: 15,
        percentage: 8,
        image: '/path/to/norway-rat.jpg',
        location: 'Waterfront'
    }
];

export default function Dashboard() {
    const [sortBy, setSortBy] = React.useState('popularity');
    const [selectedSpecies, setSelectedSpecies] = React.useState('');

    const handleSortChange = (event, newSort) => {
        if (newSort !== null) {
            setSortBy(newSort);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
                <Container maxWidth={false}>
                    {/* Header Section */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(to right, #1a237e, #1e88e5)',
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                            Welcome Back
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<MapIcon />}
                            sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                },
                            }}
                        >
                            Explore Map
                        </Button>
                    </Paper>

                    {/* Pinned Animals Section */}
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                        PINNED ANIMALS
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        {pinnedAnimals.map((animal) => (
                            <Grid item xs={12} sm={6} key={animal.name}>
                                <Card elevation={3} sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                                    <CardContent sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 3,
                                    }}>
                                        <Box>
                                            <Typography variant="h6" color="primary">
                                                {animal.name}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {animal.sightings} new sightings
                                            </Typography>
                                            <Typography color="text.secondary">
                                                {animal.percentage}% more than usual
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1, color: '#64b5f6' }}>
                                                {animal.location}
                                            </Typography>
                                        </Box>
                                        <CardMedia
                                            component="img"
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                            }}
                                            image={animal.image}
                                            alt={animal.name}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Main Content Grid */}
                    <Grid container spacing={3}>
                        {/* Left Panel */}
                        <Grid item xs={12} md={6}>
                            <ReportSighting />
                        </Grid>

                        {/* Right Panel */}
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}>
                                    <ToggleButtonGroup
                                        value={sortBy}
                                        exclusive
                                        onChange={handleSortChange}
                                        size="small"
                                        sx={{
                                            '& .MuiToggleButton-root.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        <ToggleButton value="popularity">
                                            POPULARITY
                                        </ToggleButton>
                                        <ToggleButton value="alphabetical">
                                            ALPHABETICAL
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Button
                                        variant="text"
                                        color="primary"
                                        sx={{ textTransform: 'none' }}
                                    >
                                        See Popular Near You
                                    </Button>
                                </Box>

                                {/* Popular Animals List */}
                                {popularAnimals.map((animal) => (
                                    <Card
                                        key={animal.name}
                                        sx={{
                                            mb: 2,
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'scale(1.02)' },
                                        }}
                                    >
                                        <CardContent sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                        }}>
                                            <Box>
                                                <Typography variant="h6" color="primary">
                                                    {animal.name}
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    {animal.sightings} new sightings
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    {animal.percentage}% more than usual
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 1, color: '#64b5f6' }}>
                                                    {animal.location}
                                                </Typography>
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                }}
                                                image={animal.image}
                                                alt={animal.name}
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </ThemeProvider>
    );
}