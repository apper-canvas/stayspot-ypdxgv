import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hotels: [],
  selectedHotel: null,
  loading: false,
  error: null
};

export const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setHotels: (state, action) => {
      state.hotels = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedHotel: (state, action) => {
      state.selectedHotel = action.payload;
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

export const { setHotels, setSelectedHotel, setLoading, setError } = hotelsSlice.actions;
export default hotelsSlice.reducer;