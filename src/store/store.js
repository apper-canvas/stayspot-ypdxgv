import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import hotelsReducer from './hotelsSlice'
import dealsReducer from './dealsSlice'
import bookingsReducer from './bookingsSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotels: hotelsReducer,
    deals: dealsReducer,
    bookings: bookingsReducer,
  },
})