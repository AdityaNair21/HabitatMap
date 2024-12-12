import { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Grid,
    CircularProgress,
    Autocomplete,
    Avatar
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateReportBox({ open, handleClose }) {
    const [formData, setFormData] = useState({
        user: {
            userId: '',
            username: '',
            picUrl: ''
        },
        species: {
            speciesId: '',
            commonName: '',
            scientificName: '',
            description: '',
            picUrl: ''
        },
        loc: {
            coordinates: [0, 0]
        },
        description: '',
        picUrl: ['']
    });
    
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [speciesOptions, setSpeciesOptions] = useState([]);
    const [speciesLoading, setSpeciesLoading] = useState(false);
    const [viewport, setViewport] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 8
    });
    const [mapOpen, setMapOpen] = useState(false);

    useEffect(() => {
        // Fetch user info from localStorage
        const userId = localStorage.getItem('userId') || 'testId';
        const username = localStorage.getItem('username') || 'testuser';
        const picUrl = localStorage.getItem('picUrl') || 'picUrl';

        setFormData(prev => ({
            ...prev,
            user: {
                userId: userId || '',
                username: username || '',
                picUrl: picUrl || ''
            }
        }));
    }, []);

    const handleChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls([reader.result]);
                setFormData(prev => ({
                    ...prev,
                    picUrl: [reader.result]
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSpeciesSearch = async (event, value) => {
        if (value.length < 3) return; // Minimum 3 characters to search
        setSpeciesLoading(true);
        try {                               //using temp api for testing species search
            const response = await axios.get(`${API_BASE_URL}/species/search?query=${value}`);
            console.log('Species search response:', response.data); // Debugging statement
            setSpeciesOptions(response.data);
        } catch (error) {
            console.error('Error fetching species:', error);
        } finally {
            setSpeciesLoading(false);
        }
    };

    const handleSpeciesSelect = (event, value) => {
        if (value) {
            console.log('Selected species:', value); // Debugging statement
            setFormData(prev => ({
                ...prev,
                species: {
                    speciesId: value.speciesId,
                    commonName: value.commonName,
                    scientificName: value.scientificName,
                    description: value.description,
                    picUrl: value.picUrl
                }
            }));
        }
    };

    const handleMapClick = (event) => {
        console.log('Map click event:', event); // Debugging statement
        const { lng, lat } = event.lngLat;
        if (lng !== undefined && lat !== undefined) {
            const longitude = lng;
            const latitude = lat;
            setFormData(prev => ({
                ...prev,
                loc: {
                    coordinates: [longitude, latitude]
                }
            }));
            setViewport({
                ...viewport,
                latitude,
                longitude
            });
            //this will keep map open after pinning location
            //pressing close will close the map
            setMapOpen(true); 
        } else {
            console.error('Invalid lngLat:', event.lngLat);
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({
                    ...prev,
                    loc: {
                        coordinates: [longitude, latitude]
                    }
                }));
                setViewport({
                    ...viewport,
                    latitude,
                    longitude
                });
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/reports`, formData);
            handleClose();
        } catch (error) {
            console.error('Error creating report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid container spacing={2}>

                            {/* Species Section */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={speciesOptions}
                                    getOptionLabel={(option) => option.commonName}
                                    loading={speciesLoading}
                                    onInputChange={(event, value) => handleSpeciesSearch(event, value)}
                                    onChange={handleSpeciesSelect}
                                    //using stating image link for testing Avatar src
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ display: 'flex', alignItems: 'center' }} {...props}>
                                            <Avatar src={option.picUrl} alt={option.commonName} sx={{ mr: 2 }} />
                                            {option.commonName}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Species"
                                            fullWidth
                                            required
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {speciesLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Common Name"
                                    value={formData.species.commonName}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Scientific Name"
                                    value={formData.species.scientificName}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.species.description}
                                    multiline
                                    rows={4}
                                    disabled
                                />
                            </Grid>

                            {/* Location Section */}
                            <Grid item xs={12}>
                                <Button variant="contained" onClick={() => setMapOpen(true)}>
                                    Use Map to Pin Location
                                </Button>
                                <Button variant="contained" onClick={handleUseCurrentLocation} sx={{ ml: 2 }}>
                                    Use Current Location
                                </Button>
                            </Grid>

                            {/* Report Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Report Description"
                                    value={formData.description}
                                    onChange={(e) => handleChange(null, 'description', e.target.value)}
                                />
                            </Grid>

                            {/* Report Picture */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<AddPhotoAlternateIcon />}
                                >
                                    Upload Picture
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {previewUrls.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <img src={previewUrls[0]} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Map Dialog */}
            <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Pin Location on Map</DialogTitle>
                <DialogContent>
                    <Box sx={{ height: 400 }}>
                        <Map
                            initialViewState={viewport}
                            style={{ width: '100%', height: '100%' }}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken={MAPBOX_TOKEN}
                            onClick={handleMapClick}
                        >
                            <Marker
                                longitude={formData.loc.coordinates[0]}
                                latitude={formData.loc.coordinates[1]}
                                color="red"
                            />
                        </Map>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMapOpen(false)} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}