export const getDaysInMonth = (year, month) => {
  // month is 0-based (0=January)
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  // returns 0=Sunday, 1=Monday, etc.
  return new Date(year, month, 1).getDay();
};

export const formatDateForMatch = (dayNumber, month) => {
  // month is 0-based
  const m = month + 1;
  return `${String(dayNumber).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
};