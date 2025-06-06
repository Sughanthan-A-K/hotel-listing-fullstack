import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all hotels
export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async () => {
  const response = await axios.get('http://localhost:5000/api/hotels');
  return response.data;
});

// Delete a hotel by ID
export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (hotelId) => {
    await axios.delete(`http://localhost:5000/api/hotels/${hotelId}`);
    return hotelId; // return id so we can remove it from state
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchHotels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete hotel cases
      .addCase(deleteHotel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the hotel with the given ID from data array
        state.data = state.data.filter(hotel => hotel.hotel_id !== action.payload);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default hotelSlice.reducer;
