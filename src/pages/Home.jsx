import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { setHotels, setLoading as setHotelsLoading } from '../store/hotelsSlice';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import hotelService from '../services/hotelService';
import searchService from '../services/searchService';
import showToast from '../utils/toastUtils';

// Get hotels from Redux store
const useHotelsFromStore = () => useSelector((state) => state.hotels.hotels);

export default function Home() {
  // Icon components
  const SearchIcon = getIcon('Search');
  const StarIcon = getIcon('Star');
  const MapPinIcon = getIcon('MapPin');
  const InfoIcon = getIcon('Info');
  const HeartIcon = getIcon('Heart');
  const ShowerHeadIcon = getIcon('ShowerHead');
  const UtensilsIcon = getIcon('Utensils');
  const DumbbellIcon = getIcon('Dumbbell');
  const WifiIcon = getIcon('Wifi');
  const PawPrintIcon = getIcon('PawPrint');

  const dispatch = useDispatch();
  const storeHotels = useHotelsFromStore();
  // State
  const [searchParams, setSearchParams] = useState({
    location: "",
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    guests: 2
  });

  const [searchResults, setSearchResults] = useState([]); 
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Load initial hotels
  useEffect(() => {
    const loadInitialHotels = async () => {
      const hotels = await hotelService.fetchHotels();
      dispatch(setHotels(hotels));
    };
    loadInitialHotels();
  }, [dispatch]);

  // Handle search form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!searchParams.location) {
      showToast.error("Please enter a destination");
      setLoading(false);
      return;
    }

    // Calculate stay duration
    const checkInDate = parseISO(searchParams.checkIn);
    const checkOutDate = parseISO(searchParams.checkOut);
    const nights = differenceInDays(checkOutDate, checkInDate);

    if (nights < 1) {
      showToast.error("Check-out date must be after check-in date");
      setLoading(false);
      return;
    }

    // Perform search with real data
    const performSearch = async () => {
      try {
        // Save the search request to the database
        await searchService.saveSearchRequest(searchParams);
        
        // Fetch hotels matching the search criteria
        const filteredHotels = await hotelService.fetchHotels({
          location: searchParams.location
        });

      setSearchResults(filteredHotels);
      setHasSearched(true);
      setLoading(false);

      if (filteredHotels.length === 0) {
        showToast.info("No hotels found for your search criteria. Try a different location.");
      } else {
        showToast.success(`Found ${filteredHotels.length} hotels for your stay!`);
      }
      } catch (error) {
        showToast.error("Search failed. Please try again.");
        setLoading(false);
      }
    };
    
    performSearch();
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    switch(amenity.toLowerCase()) {
      case 'pool':
      case 'hot tub':
        return <ShowerHeadIcon className="w-4 h-4" />;
      case 'restaurant':
      case 'bar':
        return <UtensilsIcon className="w-4 h-4" />;
      case 'fitness center':
      case 'gym':
        return <DumbbellIcon className="w-4 h-4" />;
      case 'wifi':
        return <WifiIcon className="w-4 h-4" />;
      case 'pet friendly':
        return <PawPrintIcon className="w-4 h-4" />;
      default:
        return <InfoIcon className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <section className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8 bg-gradient-to-br from-primary-light/10 to-secondary-light/5 dark:from-primary-dark/20 dark:to-secondary-dark/10"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary dark:text-primary-light">Find Your Perfect Stay</h2>
            
            <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
              <div className="md:col-span-4">
                <label htmlFor="location" className="label">Destination</label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                    placeholder="City, region or hotel name"
                    className="input-field pl-10"
                  />
                  <MapPinIcon className="absolute left-3 top-3 w-4 h-4 text-primary" />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <label htmlFor="checkIn" className="label">Check In</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={searchParams.checkIn}
                  onChange={handleInputChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="input-field"
                />
              </div>
              
              <div className="md:col-span-3">
                <label htmlFor="checkOut" className="label">Check Out</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={searchParams.checkOut}
                  onChange={handleInputChange}
                  min={searchParams.checkIn}
                  className="input-field"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="guests" className="label">Guests</label>
                <select
                  id="guests"
                  name="guests"
                  value={searchParams.guests}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-12 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full md:w-auto flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-5 h-5" />
                      <span>Search Hotels</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Main Feature Component */}
      <MainFeature />
      
      {/* Search Results */}
      {hasSearched && (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            {searchResults.length > 0 
              ? `Available Hotels in ${searchParams.location}`
              : `No hotels found in ${searchParams.location}`}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map(hotel => (
              <motion.div
                key={hotel.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="card group hover:shadow-lg dark:hover:border-primary-light/40 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={hotel.imageUrl} 
                    alt={hotel.name}
                    alt={hotel.Name}
                  />
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-surface-800/80 hover:bg-white dark:hover:bg-surface-700 transition-colors">
                    <HeartIcon className="w-5 h-5 text-surface-400 hover:text-secondary transition-colors" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{hotel.name}</h3>
                    <h3 className="text-lg font-bold">{hotel.Name}</h3>
                      <StarIcon className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <p className="flex items-center gap-1 text-surface-600 dark:text-surface-400 mb-3">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{hotel.location}</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                        +{hotel.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
                    <div>
                      <span className="text-xl font-bold">${hotel.price}</span>
                      <span className="text-surface-500 dark:text-surface-400 text-sm"> / night</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary text-sm"
                      onClick={() => showToast.info(`Booking ${hotel.Name} is not available in this MVP.`)}
                    >
                      View Rooms
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      
      {/* Recommendations Section (shown when no search performed) */}
      {!hasSearched && (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Popular Destinations</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-6">Discover trending hotels at top destinations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeHotels.map(hotel => (
              <motion.div
                key={hotel.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: parseInt(hotel.Id) % 4 * 0.1 }}
                className="card group hover:shadow-lg dark:hover:border-primary-light/40 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={hotel.imageUrl} 
                    alt={hotel.Name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-bold">{hotel.Name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      {hotel.location}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-surface-800/90 rounded-md px-2 py-1 flex items-center gap-1">
                    <StarIcon className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium">{hotel.rating}</span>
                  </div>
                </div>
                
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold">${hotel.price}</span>
                    <span className="text-surface-500 dark:text-surface-400 text-xs"> / night</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-sm btn-outline text-xs px-3 py-1"
                    onClick={() => showToast.info(`Quick booking for ${hotel.Name} is not available in this MVP.`)}
                  >
                    Quick Book
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}