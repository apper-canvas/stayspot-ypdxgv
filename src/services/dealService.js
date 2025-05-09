import getApperClient from '../utils/apperClient';
import showToast from '../utils/toastUtils';

const TABLE_NAME = 'deal';

// Fields to fetch for deals
const DEAL_FIELDS = [
  'Id',
  'Name',
  'hotel',
  'location',
  'originalPrice',
  'discountedPrice',
  'discount',
  'amenities',
  'image',
  'dateRange',
  'favorite'
];

// Get all deals
export const fetchDeals = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Set up params for fetching deals
    const params = {
      fields: DEAL_FIELDS,
      orderBy: [{ field: "discount", direction: "desc" }],
      convertNullToUnknown: false
    };
    
    // Add location filter if provided
    if (filters.location) {
      params.where = [
        { field: "location", operator: "contains", value: filters.location }
      ];
    }
    
    // Add price filter if provided
    if (filters.maxPrice) {
      params.where = params.where || [];
      params.where.push({ field: "discountedPrice", operator: "lessThanOrEqual", value: filters.maxPrice });
    }
    
    // Filter by favorite status if requested
    if (filters.favoritesOnly) {
      params.where = params.where || [];
      params.where.push({ field: "favorite", operator: "equals", value: true });
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching deals:", error);
    showToast.error("Failed to load deals. Please try again.");
    return [];
  }
};

// Get a single deal by ID
export const getDealById = async (dealId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: DEAL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, dealId, params);
    
    if (!response || !response.data) {
      showToast.error("Deal not found");
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching deal with ID ${dealId}:`, error);
    showToast.error("Failed to load deal details. Please try again.");
    return null;
  }
};

// Create a new deal
export const createDeal = async (dealData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [dealData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      showToast.error("Failed to create deal");
      return null;
    }
    
    showToast.success("Deal created successfully");
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating deal:", error);
    showToast.error("Failed to create deal. Please try again.");
    return null;
  }
};

// Toggle favorite status for a deal
export const toggleFavorite = async (dealId, currentStatus) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [
        {
          Id: dealId,
          favorite: !currentStatus
        }
      ]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      showToast.error("Failed to update favorite status");
      return false;
    }
    
    if (!currentStatus) {
      showToast.success("Added to favorites");
    } else {
      showToast.info("Removed from favorites");
    }
    
    return true;
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    showToast.error("Failed to update favorite status. Please try again.");
    return false;
  }
};

const dealService = {
  fetchDeals,
  getDealById,
  createDeal,
  toggleFavorite
};

export default dealService;