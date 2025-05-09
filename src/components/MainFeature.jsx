import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';
import dealService from '../services/dealService';
import bookingService from '../services/bookingService';
import showToast from '../utils/toastUtils';
import { setDeals, toggleFavorite as toggleFavoriteAction, setLoading } from '../store/dealsSlice';

export default function MainFeature() {
  const dispatch = useDispatch();

  // State for selected deal
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  // State for booking form
  const [bookingForm, setBookingForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    rooms: 1,
    specialRequests: ""
  });
  
  // State for form errors

  // Get deals from Redux store
  const deals = useSelector((state) => state.deals.deals);
  
  // Load deals on component mount
  useEffect(() => {
    const loadDeals = async () => {
      dispatch(setLoading(true));
      const dealsData = await dealService.fetchDeals();
      dispatch(setDeals(dealsData));
    };
    loadDeals();
  }, [dispatch]);
  const [formErrors, setFormErrors] = useState({});
  
  // Set default dates when a deal is selected
  useEffect(() => {
    if (selectedDeal) {
      const today = new Date();
      const checkIn = new Date(today.setDate(today.getDate() + 30));
      const checkOut = new Date(today.setDate(today.getDate() + 3));
      
      setBookingForm({
        ...bookingForm,
        checkIn: formatDateForInput(checkIn),
        checkOut: formatDateForInput(checkOut)
      });
    }
  }, [selectedDeal]);
  
  // Function to format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  // Icon components
  const CalendarIcon = getIcon('Calendar');
  const UsersIcon = getIcon('Users');
  const BedDoubleIcon = getIcon('BedDouble');
  const CoffeeIcon = getIcon('Coffee');
  const WifiIcon = getIcon('Wifi');
  const TvIcon = getIcon('Tv');
  const SwimmingPoolIcon = getIcon('SwimmingPool');
  const DumbbellIcon = getIcon('Dumbbell');
  const UtensilsIcon = getIcon('Utensils');
  const ParkingSquareIcon = getIcon('ParkingSquare');
  const HeartIcon = getIcon('Heart');
  const HeartFilledIcon = getIcon('HeartHandshake');
    ));
  // Function to handle toggling favorite status in database and Redux
  };
  
  // Function to handle booking
  const handleBooking = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!bookingForm.checkIn) errors.checkIn = "Check-in date is required";
    if (!bookingForm.checkOut) errors.checkOut = "Check-out date is required";
    if (bookingForm.checkIn && bookingForm.checkOut && new Date(bookingForm.checkIn) >= new Date(bookingForm.checkOut)) {
      errors.checkOut = "Check-out date must be after check-in date";
    }
    
      setFormErrors(errors); 
      setFormErrors(errors);
      return;
    }
    // Create a booking in the database
    const createNewBooking = async () => {
      const bookingData = {
        deal: selectedDeal.Id,
        ...bookingForm
      };
      
      const result = await bookingService.createBooking(bookingData);
      if (result) {
        setSelectedDeal(null);
      }
    };
    setSelectedDeal(null);
    
    // Reset form
    setBookingForm({
      checkIn: "",
      checkOut: "",
      guests: 2,
      rooms: 1,
      specialRequests: ""
    
    createNewBooking();
  };
  
  // Function to toggle favorite
  const toggleFavorite = async (dealId) => {
    try {
      const deal = deals.find(d => d.Id === dealId);
      const success = await dealService.toggleFavorite(dealId, deal.favorite);
      if (success) {
        dispatch(toggleFavoriteAction(dealId));
      }
    } catch (error) {
      showToast.error("Failed to update favorite status");
    }
    });
  };
  
  // Function to get amenity icon
  const getAmenityIcon = (amenity) => {
    switch(amenity.toLowerCase()) {
      case 'pool':
        return <SwimmingPoolIcon className="w-4 h-4" />;
      case 'breakfast':
        return <CoffeeIcon className="w-4 h-4" />;
      case 'wifi':
        return <WifiIcon className="w-4 h-4" />;
      case 'tv':
        return <TvIcon className="w-4 h-4" />;
      case 'gym':
        return <DumbbellIcon className="w-4 h-4" />;
      case 'restaurant':
        return <UtensilsIcon className="w-4 h-4" />;
      case 'parking':
        return <ParkingSquareIcon className="w-4 h-4" />;
      default:
        return <BedDoubleIcon className="w-4 h-4" />;
    }
  };
  
  return (
    <section className="mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light">Exclusive Hotel Deals</h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Book now for special rates and packages</p>
        </div>
        
        <div className="mt-4 md:mt-0 hidden md:block">
          <span className="inline-flex items-center bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-light px-3 py-1 rounded-full text-sm font-medium">
            <span className="animate-pulse mr-2">●</span> Limited Time Offers
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map(deal => (
          <motion.div
            key={deal.Id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <div className="card overflow-hidden h-full flex flex-col">
              {/* Image Section */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={deal.image}
                  alt={deal.Name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                
                {/* Deal Badge */}
                <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {deal.discount}% OFF
                </div>
                
                {/* Favorite Button */}
                  onClick={() => toggleFavorite(deal.Id)}
                  onClick={() => toggleFavorite(deal.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-surface-800/80 hover:bg-white dark:hover:bg-surface-700 transition-colors"
                >
                  {deal.favorite ? (
                    <HeartFilledIcon className="w-5 h-5 text-secondary" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-surface-400 group-hover:text-secondary" />
                  )}
                </button>
                
                {/* Hotel Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-lg text-shadow">{deal.Name}</h3>
                  <p className="text-sm text-white/90">{deal.hotel} • {deal.location}</p>
                </div>
              </div>
              
              {/* Deal Details */}
              <div className="p-4 flex-grow flex flex-col">
                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 mb-3">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{deal.dateRange}</span>
                </div>
                
                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {deal.amenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="flex items-center gap-1 text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                </div>
                
                {/* Price */}
                <div className="mt-auto pt-3 border-t border-surface-200 dark:border-surface-700 flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="text-sm text-surface-500 dark:text-surface-400 line-through">${deal.originalPrice}</span>
                    <div>
                      <span className="text-xl font-bold">${deal.discountedPrice}</span>
                      <span className="text-surface-500 dark:text-surface-400 text-sm"> / night</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDeal(deal)}
                    className="btn btn-primary"
                  >
                    Book Now
                </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedDeal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-48">
                <img 
                  alt={selectedDeal.Name}
                  alt={selectedDeal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <button 
                  onClick={() => setSelectedDeal(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-surface-800/80 hover:bg-white dark:hover:bg-surface-700 transition-colors"
                >
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-surface-800 dark:text-surface-200" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </motion.svg>
                </button>
                  <h3 className="font-bold text-xl text-shadow">{selectedDeal.Name}</h3>
                  <p className="text-sm text-white/90">{selectedDeal.hotel} • {selectedDeal.location}</p>
                  <p className="text-sm text-white/90">{selectedDeal.hotel} • {selectedDeal.location}</p>
                </div>
              </div>
              
              {/* Booking Form */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-secondary/10 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-light px-3 py-1 rounded-full text-sm font-medium">
                      {selectedDeal.discount}% OFF
                    </div>
                    <span className="text-sm text-surface-500 dark:text-surface-400 line-through">${selectedDeal.originalPrice}</span>
                  </div>
                  <div>
                    <span className="text-xl font-bold">${selectedDeal.discountedPrice}</span>
                    <span className="text-surface-500 dark:text-surface-400 text-sm"> / night</span>
                  </div>
                </div>
                
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkIn" className="label">Check In</label>
                      <input
                        type="date"
                        id="checkIn"
                        name="checkIn"
                        value={bookingForm.checkIn}
                        onChange={handleInputChange}
                        min={formatDateForInput(new Date())}
                        className={`input-field ${formErrors.checkIn ? 'border-red-500 dark:border-red-500' : ''}`}
                        required
                      />
                      {formErrors.checkIn && (
                        <p className="mt-1 text-xs text-red-500">{formErrors.checkIn}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="checkOut" className="label">Check Out</label>
                      <input
                        type="date"
                        id="checkOut"
                        name="checkOut"
                        value={bookingForm.checkOut}
                        onChange={handleInputChange}
                        min={bookingForm.checkIn}
                        className={`input-field ${formErrors.checkOut ? 'border-red-500 dark:border-red-500' : ''}`}
                        required
                      />
                      {formErrors.checkOut && (
                        <p className="mt-1 text-xs text-red-500">{formErrors.checkOut}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="guests" className="label flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" />
                        Guests
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={bookingForm.guests}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rooms" className="label flex items-center gap-1">
                        <BedDoubleIcon className="w-4 h-4" />
                        Rooms
                      </label>
                      <select
                        id="rooms"
                        name="rooms"
                        value={bookingForm.rooms}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="specialRequests" className="label">Special Requests (Optional)</label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requests for your stay..."
                      className="input-field min-h-[80px]"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn btn-primary w-full"
                    >
                      Complete Booking
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}