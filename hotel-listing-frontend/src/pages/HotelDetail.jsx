import { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Helmet } from 'react-helmet-async';
import 'leaflet/dist/leaflet.css';

const HotelDetail = () => {
  const { id } = useParams();
  const { data: hotels, loading } = useSelector(state => state.hotels);
  const [hotel, setHotel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundHotel = hotels.find(h => h.hotel_id.toString() === id);
    setHotel(foundHotel);
  }, [id, hotels]);

  if (loading || !hotel) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  const {
    hotel_title,
    hotel_description,
    hotel_price,
    hotel_image_url,
    hotel_latitude,
    hotel_longitude,
  } = hotel;
  const imageSrc = `http://localhost:5000${hotel_image_url}`;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#0A2540', overflowX: 'hidden' }}>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          maxWidth: { xs: '100%', sm: 600, md: 900, lg: 1200 },
          mx: 'auto',
        }}
      >
        <Helmet>
          <title>{hotel_title} - Hotel Details</title>
          <meta name="description" content={hotel_description} />
          <meta property="og:title" content={hotel_title} />
          <meta property="og:description" content={hotel_description} />
          <meta property="og:image" content={imageSrc} />
        </Helmet>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', p: { xs: 2, sm: 3 } }}>
          {/* Hotel Title and Back Button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <IconButton onClick={() => navigate('/hotels')} sx={{ mr: 1, mb: { xs: 2, sm: 2 } }}>
              <ArrowBackIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: '#333' }} />
            </IconButton>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontSize: { xs: '1.4rem', sm: '2rem', md: '2.4rem' },
                fontWeight: 700,
                color: '#333',
                wordBreak: 'break-word',
              }}
            >
              {hotel_title}
            </Typography>
          </Box>

          {/* Hotel Image */}
          <Box
            component="img"
            src={imageSrc}
            alt={hotel_title}
            sx={{
              width: '100%',
              maxWidth: 700,
              height: { xs: 200, sm: 300, md: 400 },
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: 3,
              mb: 3,
              mx: 'auto',
              display: 'block',
            }}
          />

          {/* Description */}
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: 'black',
              fontWeight: 600,
              lineHeight: 1.7,
              mb: 1,
            }}
          >
            About this property
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              color: '#555',
              mb: 2,
              lineHeight: 1.7,
              wordBreak: 'break-word',
            }}
          >
            {hotel_description}
          </Typography>

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.3rem' },
              mb: 3,
              color: 'green',
            }}
          >
            Price: ₹{hotel_price}
          </Typography>

          {/* Map */}
          <Box>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                mb: 1,
                color: '#333',
              }}
            >
              Location
            </Typography>
            <Box
              sx={{
                height: { xs: 250, sm: 300, md: 350 },
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 2,
              }}
            >
              <MapContainer
                center={[hotel_latitude, hotel_longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[hotel_latitude, hotel_longitude]}>
                  <Popup>{hotel_title}</Popup>
                </Marker>
              </MapContainer>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default HotelDetail;
