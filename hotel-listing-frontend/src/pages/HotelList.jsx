import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels, deleteHotel } from '../redux/hotelSlice'; 
import { useNavigate, useLocation } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import HotelLogo from "../assets/images/HotelLogo.svg";
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Pagination,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';

const ITEMS_PER_PAGE = 6;

const HotelList = () => {
  const dispatch = useDispatch();
  const { data: hotels, loading, error } = useSelector(state => state.hotels);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAddHotel = () => {
    navigate('/hotels/add');
  };

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  useEffect(() => {
    let filtered = hotels;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(hotel =>
        hotel.hotel_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice !== '') {
      filtered = filtered.filter(hotel => hotel.hotel_price >= parseFloat(minPrice));
    }

    if (maxPrice !== '') {
      filtered = filtered.filter(hotel => hotel.hotel_price <= parseFloat(maxPrice));
    }

    setFilteredHotels(filtered);
    setPage(1);
  }, [hotels, searchTerm, minPrice, maxPrice]);

  const pageCount = Math.ceil(filteredHotels.length / ITEMS_PER_PAGE);
  const paginatedHotels = filteredHotels.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleDelete = async () => {
    try {
      await dispatch(deleteHotel(deleteId)).unwrap();
      setSnackbarMessage('Hotel deleted successfully!');
      setSnackbarOpen(true);
      setDeleteId(null);
    } catch (error) {
      alert('Failed to delete hotel. Please try again.');
    }
  };

  useEffect(() => {
    if (location.state?.message) {
      setSnackbarMessage(location.state.message);
      setSnackbarOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F4F6F8',
      }}
    >
      {/* Top App Bar */}
      <Box
        sx={{
          backgroundColor: '#0A2540',
          boxShadow: '0 4px 6px -4px rgba(0, 0, 0, 0.2)',
          px: { xs: 2, sm: 4 },
          py: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={HotelLogo} alt="Hotel Logo" style={{ width: 30, height: 30 }} />
            <Typography
              sx={{
                fontSize: { xs: '22px', sm: '26px', md: '30px' },
                ml: 1,
                pt: '4px',
                color: 'white',
              }}
            >
              Hotels.com
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Button
              onClick={handleAddHotel}
              sx={{
                textTransform: 'none',
                color: 'white',
                '&:hover': { color: 'white', backgroundColor: '#FFB300' },
              }}
            >
              Add Hotel
            </Button>
            <TextField
              placeholder="Search by Title"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="small"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '& input::placeholder': { color: 'white', opacity: 1 },
                },
              }}
              InputProps={{
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <ClearIcon
                      size="small"
                      onClick={() => setSearchTerm('')}
                      sx={{ color: 'white', cursor: 'pointer' }}
                    />
                  </InputAdornment>
                ) : null,
              }}
            />
          </Stack>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          px: { xs: 2, sm: 4 },
          py: 2,
          gap: 2,
          overflow: 'hidden',
        }}
      >
        {/* Filter Panel */}
        <Paper
          sx={{
            width: { xs: '100%', md: '25%' },
            p: 3,
            boxSizing: 'border-box',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <Typography sx={{ mb: 2, fontSize: '20px', color: '#0A2540' }}>Filter</Typography>
          <Stack spacing={2}>
            <TextField
              label="Min Price"
              type="number"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              size="small"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Max Price"
              type="number"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              size="small"
              inputProps={{ min: 0 }}
            />
            <Button
              onClick={() => {
                setSearchTerm('');
                setMinPrice('');
                setMaxPrice('');
              }}
              sx={{
                textTransform: 'none',
                color: 'black',
                bgcolor: 'white',
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#0A2540',
                },
              }}
            >
              Clear Filters
            </Button>
          </Stack>
        </Paper>

        {/* Hotel List */}
        <Paper
          sx={{
            width: { xs: '100%', md: '75%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 1,
              p: 2,
              overflowY: 'auto',
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <CircularProgress sx={{ color: '#0A2540' }} />
              </Box>
            ) : error || hotels.length === 0 ? (
              <Typography sx={{ m: 'auto' }}>Page Not Load or 404 Page Error</Typography>
            ) : paginatedHotels.length === 0 ? (
              <Typography sx={{ m: 'auto' }}>No hotels found.</Typography>
            ) : (
              paginatedHotels.map(hotel => (
                <HotelCard
                  key={hotel.hotel_id}
                  hotel={hotel}
                  onDelete={() => setDeleteId(hotel.hotel_id)}
                />
              ))
            )}
          </Box>

          <Box display="flex" justifyContent="center" py={1} borderTop="1px solid #eee">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => {
                if (pageCount > 1) setPage(value);
              }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this hotel? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteId(null)}
            sx={{
              textTransform: 'none',
              color: 'black',
              bgcolor: 'white',
              '&:hover': { color: 'white', backgroundColor: '#0A2540' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{
              mr: 2,
              textTransform: 'none',
              color: 'black',
              bgcolor: 'white',
              '&:hover': { color: 'white', backgroundColor: '#0A2540' },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HotelList;