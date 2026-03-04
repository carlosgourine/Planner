// A quick helper to convert day names to JavaScript day numbers (Sunday = 0, Monday = 1, etc.)
const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

export const generateRecurringSessions = (scheduleData, currentYear = 2026) => {
  const sessions = [];
  
  // 1. Parse the Start and End dates
  const [startDay, startMonth] = scheduleData.startDate.split('/').map(Number);
  const [endDay, endMonth] = scheduleData.endDate.split('/').map(Number);
  
  // Create actual JavaScript Date objects
  let currentDate = new Date(currentYear, startMonth - 1, startDay);
  const finalDate = new Date(currentYear, endMonth - 1, endDay);
  
  const targetDayOfWeek = dayMap[scheduleData.dayOfWeek];

  // 2. Loop through every day from Start to Finish
  while (currentDate <= finalDate) {
    
    // If the current day in the loop matches your target day (e.g., it's a Monday)
    if (currentDate.getDay() === targetDayOfWeek) {
      
      // Format it nicely back to DD/MM
      const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      
      // Create the individual session object and push it to our list
      sessions.push({
        id: `${scheduleData.course}-${formattedDate}-${scheduleData.startTime}`,
        course: scheduleData.course,
        type: scheduleData.type,
        date: formattedDate,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        status: 'SCHEDULED', // Default status before you miss it
        color: scheduleData.color
      });
    }
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 3. Return the full array of generated classes
  return sessions;
};
