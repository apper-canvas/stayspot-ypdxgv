import getApperClient from '../utils/apperClient';
import showToast from '../utils/toastUtils';

const TABLE_NAME = 'booking';

// Fields to fetch for bookings
const BOOKING_FIELDS = [
  'Id',
  'Name',
  'deal',
  'checkIn',
  'checkOut',
  'guests',
  'rooms',
  'specialRequests',
  'CreatedOn'
];

// Get all bookings for the current user
export const fetchUserBookings = async () => {
  try {
    const apperClient = getApperClient();
    
    // Set up params for fetching user's bookings
    const params = {
      fields: BOOKING_FIELDS,
      orderBy: [{ field: "CreatedOn", direction: "desc" }],
      expands: [
        {
          name: "deal",
          alias: "dealDetails"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    showToast.error("Failed to load your bookings. Please try again.");
    return [];
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: BOOKING_FIELDS,
      expands: [
        {
          name: "deal",
          alias: "dealDetails"
        }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, bookingId, params);
    
    if (!response || !response.data) {
      showToast.error("Booking not found");
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${bookingId}:`, error);
    showToast.error("Failed to load booking details. Please try again.");
    return null;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const apperClient = getApperClient();
    
    // Generate a booking name if not provided
    if (!bookingData.Name) {
      const dealId = bookingData.deal;
      const checkIn = new Date(bookingData.checkIn).toISOString().split('T')[0];
      bookingData.Name = `Booking-${dealId}-${checkIn}`;
    }
    
    const params = {
      records: [bookingData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      showToast.error("Failed to create booking");
      return null;
    }
    
    showToast.success("Booking confirmed successfully!");
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating booking:", error);
    showToast.error("Failed to create booking. Please try again.");
    return null;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const apperClient = getApperClient();
    
    // Use the delete record functionality to cancel a booking
    const params = {
      RecordIds: [bookingId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      showToast.error("Failed to cancel booking");
      return false;
    }
    
    showToast.success("Booking cancelled successfully");
    return true;
  } catch (error) {
    console.error(`Error cancelling booking with ID ${bookingId}:`, error);
    showToast.error("Failed to cancel booking. Please try again.");
    return false;
  }
};

const bookingService = {
  fetchUserBookings,
  getBookingById,
  createBooking,
  cancelBooking
};

export default bookingService;