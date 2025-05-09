import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
});

export const { setBookings, setSelectedBooking, setLoading, setError } = bookingsSlice.actions;
export default bookingsSlice.reducer;