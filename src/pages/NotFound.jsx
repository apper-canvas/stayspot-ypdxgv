import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  // Icon components
  const MapIcon = getIcon('Map');
  const HomeIcon = getIcon('Home');
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-primary-light/20 dark:bg-primary-dark/20 rounded-full flex items-center justify-center">
            <MapIcon className="w-16 h-16 text-primary dark:text-primary-light" />
          </div>
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              y: [0, -5, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
          >
            🏨
          </motion.div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-primary dark:text-primary-light">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Oops! It seems like the accommodation you're looking for has checked out.
          Let's help you find your way back to available listings.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary flex items-center gap-2 mx-auto"
          >
            <HomeIcon className="w-5 h-5" />
            Return to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}