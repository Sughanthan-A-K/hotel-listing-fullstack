import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useState } from 'react';
import axios from 'axios';

const HotelForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const hotel = useSelector((state) =>
    state.hotels.data.find((h) => h.hotel_id === parseInt(id))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
  } = useForm();

  const handleBack = () => {
    reset();
    setPreview(null);
    navigate('/hotels');
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      if (data.hotel_image && data.hotel_image.length > 0) {
        formData.append('hotel_image', data.hotel_image[0]);
      }
      formData.append('title', data.hotel_title);
      formData.append('description', data.hotel_description);
      formData.append('latitude', data.hotel_latitude);
      formData.append('longitude', data.hotel_longitude);
      formData.append('price', data.hotel_price);

      const url = isEdit
        ? `http://localhost:5000/api/hotels/${hotel.hotel_id}`
        : 'http://localhost:5000/api/hotels';

      const method = isEdit ? 'put' : 'post';

      await axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/hotels', {
        state: {
          message: `Hotel ${isEdit ? 'updated' : 'created'} successfully!`,
        },
      });
    } catch (error) {
      console.error('Failed to save hotel:', error);
      alert('Something went wrong.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${hotel.hotel_id}`);
      setSnackbarMessage('Hotel deleted successfully!');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setTimeout(() => {
        navigate('/hotels');
      }, 1500);
    } catch (error) {
      console.error('Failed to delete hotel:', error);
      setSnackbarMessage('Something went wrong while deleting the hotel.');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (isEdit && hotel) {
      reset({
        hotel_title: hotel.hotel_title,
        hotel_description: hotel.hotel_description,
        hotel_latitude: hotel.hotel_latitude,
        hotel_longitude: hotel.hotel_longitude,
        hotel_price: hotel.hotel_price,
      });
      if (hotel.hotel_image_url) {
        setPreview(`http://localhost:5000${hotel.hotel_image_url}`);
      }
    }
  }, [isEdit, hotel, reset]);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: '#0A2540',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          width: {
            xs: '95%', // mobile: almost full width
            sm: 600, // tablet
            md: 800, // laptop
          },
          maxHeight: {
            xs: '90vh', // mobile max height for scroll
            sm: '85vh',
            md: 700,
          },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          bgcolor: 'white',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            borderBottom: '1px solid #ddd',
            bgcolor: 'background.paper',
            zIndex: 10,
          }}
        >
          <IconButton onClick={handleBack} size="small" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" noWrap>
            {isEdit ? 'Edit Hotel' : 'Add Hotel'}
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            overflowY: 'auto',
            flexGrow: 1,
            px: { xs: 2, sm: 3 },
            py: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#ccc',
              borderRadius: '3px',
            },
          }}
        >
          {/* Image */}
          <Box mb={2}>
            <InputLabel>Hotel Image</InputLabel>
            <input
              type="file"
              accept="image/*"
              {...register('hotel_image', {
                required: !isEdit ? 'Image is required' : false,
              })}
              onChange={(e) => {
                onImageChange(e);
                trigger('hotel_image');
              }}
              style={{ marginTop: 8 }}
            />
            {errors.hotel_image && (
              <Typography color="error" variant="caption">
                {errors.hotel_image.message}
              </Typography>
            )}
            {preview && (
              <Box mt={2}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 200,
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Title */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Hotel Title"
              {...register('hotel_title', {
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
                maxLength: {
                  value: 80,
                  message: 'Title must be at most 80 characters',
                },
              })}
              error={!!errors.hotel_title}
              helperText={errors.hotel_title?.message}
            />
          </Box>

          {/* Description */}
          <Box mb={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              inputProps={{ maxLength: 500 }}
              {...register('hotel_description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters',
                },
                maxLength: {
                  value: 500,
                  message: 'Description must be at most 500 characters',
                },
              })}
              error={!!errors.hotel_description}
              helperText={errors.hotel_description?.message}
            />
            <Typography
              variant="caption"
              align="right"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {watch('hotel_description')?.length || 0}/500
            </Typography>
          </Box>

          {/* Latitude */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Latitude"
              type="number"
              inputProps={{ step: 'any' }}
              {...register('hotel_latitude', {
                required: 'Latitude is required',
              })}
              error={!!errors.hotel_latitude}
              helperText={errors.hotel_latitude?.message}
            />
          </Box>

          {/* Longitude */}
          <Box mb={2}>
            <TextField
              fullWidth
              label="Longitude"
              type="number"
              inputProps={{ step: 'any' }}
              {...register('hotel_longitude', {
                required: 'Longitude is required',
              })}
              error={!!errors.hotel_longitude}
              helperText={errors.hotel_longitude?.message}
            />
          </Box>

          {/* Price */}
          <Box mb={3}>
            <TextField
              fullWidth
              label="Price (₹)"
              type="text"
              inputProps={{ maxLength: 6 }}
              {...register('hotel_price', {
                required: 'Price is required',
                pattern: {
                  value: /^\d{1,6}$/,
                  message: 'Only digits allowed, up to 6 digits',
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9]/g, '')
                  .slice(0, 6);
              }}
              error={!!errors.hotel_price}
              helperText={errors.hotel_price?.message}
            />
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: 'flex',
              borderTop: '1px solid #ddd',
              height: 50,
              bgcolor: 'background.paper',
              mt: isEdit ? { xs: 2, md: 3 } : { xs: 5, md: 10 },
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              type="submit"
              fullWidth
              sx={{
                textTransform: 'none',
                color: 'black',
                bgcolor: 'white',
                borderRadius: 0,
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#0A2540',
                  border: '1px solid white',
                },
              }}
            >
              Save Hotel
            </Button>

            {isEdit && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  color: 'black',
                  bgcolor: 'white',
                  borderRadius: 0,
                  '&:hover': {
                    color: 'white',
                    backgroundColor: '#0A2540',
                    border: '1px solid white',
                  },
                }}
              >
                Delete Hotel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this hotel? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
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
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{
              mr: '20px',
              textTransform: 'none',
              color: 'black',
              bgcolor: 'white',
              '&:hover': {
                color: 'white',
                backgroundColor: '#0A2540',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelForm;
