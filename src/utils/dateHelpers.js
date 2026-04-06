export const getTodayDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  return timeString; 
};