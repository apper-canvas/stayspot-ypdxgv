import getApperClient from '../utils/apperClient';
import showToast from '../utils/toastUtils';

const TABLE_NAME = 'search_request';

// Fields for search requests
const SEARCH_FIELDS = [
  'Id',
  'location',
  'checkIn',
  'checkOut',
  'guests',
  'CreatedOn'
];

// Save a search request
export const saveSearchRequest = async (searchData) => {
  try {
    const apperClient = getApperClient();
    
    // Generate a name for the search request if not provided
    const searchName = `${searchData.location} - ${searchData.checkIn} to ${searchData.checkOut}`;
    
    const params = {
      records: [{
        Name: searchName,
        location: searchData.location,
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      return null;
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error saving search request:", error);
    return null;
  }
};

// Get recent search requests
export const getRecentSearches = async (limit = 5) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: SEARCH_FIELDS,
      orderBy: [{ field: "CreatedOn", direction: "desc" }],
      pagingInfo: { limit, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    return response && response.data ? response.data : [];
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    return [];
  }
};

export default { saveSearchRequest, getRecentSearches };