import getApperClient from '../utils/apperClient';
import showToast from '../utils/toastUtils';

const TABLE_NAME = 'hotel';

// Fields to fetch for hotels
const HOTEL_FIELDS = [
  'Id',
  'Name',
  'location',
  'price',
  'rating',
  'imageUrl',
  'amenities'
];

// Get all hotels with optional filtering
export const fetchHotels = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Set up params for fetching hotels
    const params = {
      fields: HOTEL_FIELDS,
      orderBy: [{ field: "rating", direction: "desc" }],
      convertNullToUnknown: false
    };
    
    // Add location filter if provided
    if (filters.location) {
      params.where = [
        { field: "location", operator: "contains", value: filters.location }
      ];
    }
    
    // Add price range filter if provided
    if (filters.minPrice || filters.maxPrice) {
      const priceFilters = [];
      
      if (filters.minPrice) {
        priceFilters.push({ field: "price", operator: "greaterThanOrEqual", value: filters.minPrice });
      }
      
      if (filters.maxPrice) {
        priceFilters.push({ field: "price", operator: "lessThanOrEqual", value: filters.maxPrice });
      }
      
      params.whereGroups = [{ operator: "and", where: priceFilters }];
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels:", error);
    showToast.error("Failed to load hotels. Please try again.");
    return [];
  }
};

// Get a single hotel by ID
export const getHotelById = async (hotelId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: HOTEL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, hotelId, params);
    
    if (!response || !response.data) {
      showToast.error("Hotel not found");
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching hotel with ID ${hotelId}:`, error);
    showToast.error("Failed to load hotel details. Please try again.");
    return null;
  }
};

// Create a new hotel
export const createHotel = async (hotelData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [hotelData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      showToast.error("Failed to create hotel");
      return null;
    }
    
    showToast.success("Hotel created successfully");
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating hotel:", error);
    showToast.error("Failed to create hotel. Please try again.");
    return null;
  }
};

const hotelService = {
  fetchHotels,
  getHotelById,
  createHotel
};

export default hotelService;