import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deals: [],
  selectedDeal: null,
  loading: false,
  error: null
};

export const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    toggleFavorite: (state, action) => {
      const deal = state.deals.find(deal => deal.Id === action.payload);
      if (deal) deal.favorite = !deal.favorite;
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

export const { setDeals, setSelectedDeal, toggleFavorite, setLoading, setError } = dealsSlice.actions;
export default dealsSlice.reducer;