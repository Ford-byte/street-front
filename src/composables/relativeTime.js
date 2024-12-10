export const relativeTime = (isoTimestamp) => {
    // Convert ISO 8601 string to Date object
    const pastDate = new Date(isoTimestamp);
    
    // Get the current time in UTC
    const now = new Date();
  
    // Calculate the difference in seconds
    const diffInSeconds = Math.floor((now - pastDate) / 1000);
  
  
    if (diffInSeconds < 60) {
      return `now`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 31536000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };
  