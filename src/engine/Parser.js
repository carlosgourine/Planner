export const parseCommand = (inputText) => {
  const text = inputText.trim();

  // Rule 1: The "SCHEDULE" Pattern
  // Expects: SCHEDULE "Course" TYPE EVERY Day HH:MM-HH:MM STARTING DD/MM TILL DD/MM
  const scheduleRegex = /^SCHEDULE\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE)\s+EVERY\s+([a-zA-Z]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})\s+STARTING\s+(\d{2}\/\d{2})\s+TILL\s+(\d{2}\/\d{2})/i;
  
  const scheduleMatch = text.match(scheduleRegex);
  if (scheduleMatch) {
    return {
      action: "CREATE_SCHEDULE",
      course: scheduleMatch[1],
      type: scheduleMatch[2].toUpperCase(),
      dayOfWeek: scheduleMatch[3].toLowerCase(), // e.g., "monday"
      startTime: scheduleMatch[4],
      endTime: scheduleMatch[5],
      startDate: scheduleMatch[6], // e.g., "09/02"
      endDate: scheduleMatch[7]    // e.g., "30/05"
    };
  }

  // Rule 2: The "MISSED" Pattern (From our previous code)
  const missedRegex = /^MISSED\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE)\s+ON\s+(\d{2}\/\d{2})/i;
  const missedMatch = text.match(missedRegex);
  
  if (missedMatch) {
    return {
      action: "MARK_MISSED",
      course: missedMatch[1],
      type: missedMatch[2].toUpperCase(),
      date: missedMatch[3]
    };
  }

  // If the user types gibberish
  return { status: "ERROR", message: "Command not recognized." };
};