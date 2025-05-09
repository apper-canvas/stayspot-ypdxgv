import { toast } from 'react-toastify';

// Consistent toast notifications for the application
const showToast = {
  success: (message) => {
    toast.success(message, {
      className: 'rounded-lg'
    });
  },
  error: (message) => {
    toast.error(message || 'An error occurred. Please try again.', {
      className: 'rounded-lg'
    });
  },
  info: (message) => {
    toast.info(message, {
      className: 'rounded-lg'
    });
  },
  warning: (message) => {
    toast.warning(message, {
      className: 'rounded-lg'
    });
  }
};

export default showToast;