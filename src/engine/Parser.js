// engine/Parser.js

// Helper function to parse a single command
const parseSingleCommand = (text) => {
  const cleanText = text.trim();
  if (!cleanText) return null;

  // 1. SCHEDULE Command (Now with optional COLOR)
  // Example: SCHEDULE "Web Tech" LECTURE EVERY Monday 16:00-18:00 STARTING 09/02 TILL 31/05 COLOR #8b5cf6
  const scheduleRegex = /^SCHEDULE\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE|EXAM|PC-SESSION)\s+EVERY\s+([a-zA-Z]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})\s+STARTING\s+(\d{2}\/\d{2})\s+TILL\s+(\d{2}\/\d{2})(?:\s+COLOR\s+(\S+))?/i;
  const scheduleMatch = cleanText.match(scheduleRegex);

  if (scheduleMatch) {
    return {
      action: "CREATE_SCHEDULE",
      course: scheduleMatch[1],
      type: scheduleMatch[2].toUpperCase(),
      dayOfWeek: scheduleMatch[3].toLowerCase(),
      startTime: scheduleMatch[4],
      endTime: scheduleMatch[5],
      startDate: scheduleMatch[6],
      endDate: scheduleMatch[7],
      color: scheduleMatch[8] || '#3b82f6' // Defaults to blue if you don't provide a color
    };
  }

  // 2. MISSED Command
  const missedRegex = /^MISSED\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE|EXAM|PC-SESSION)\s+ON\s+(\d{2}\/\d{2})/i;
  const missedMatch = cleanText.match(missedRegex);
  if (missedMatch) return { action: "MARK_MISSED", course: missedMatch[1], type: missedMatch[2].toUpperCase(), date: missedMatch[3] };

  // 3. CAUGHT UP Command
  const caughtUpRegex = /^CAUGHT UP\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE|EXAM|PC-SESSION)\s+ON\s+(\d{2}\/\d{2})/i;
  const caughtUpMatch = cleanText.match(caughtUpRegex);
  if (caughtUpMatch) return { action: "MARK_CAUGHT_UP", course: caughtUpMatch[1], type: caughtUpMatch[2].toUpperCase(), date: caughtUpMatch[3] };

  // 4. CANCEL Command
  const cancelRegex = /^CANCEL\s+"([^"]+)"\s+(LECTURE|LAB|EXERCISE|EXAM|PC-SESSION)\s+ON\s+(\d{2}\/\d{2})/i;
  const cancelMatch = cleanText.match(cancelRegex);
  if (cancelMatch) return { action: "CANCEL_SESSION", course: cancelMatch[1], type: cancelMatch[2].toUpperCase(), date: cancelMatch[3] };

  // 5. DELETE COURSE Command
  const deleteRegex = /^DELETE COURSE\s+"([^"]+)"/i;
  const deleteMatch = cleanText.match(deleteRegex);
  if (deleteMatch) return { action: "DELETE_COURSE", course: deleteMatch[1] };

  // 6. DETAILS Command
  const detailsRegex = /^DETAILS$/i;
  if (detailsRegex.test(cleanText)) return { action: "SHOW_DETAILS" };

  return { status: "ERROR", message: `Command not recognized: ${cleanText}` };
};

// The Main Export: Now handles an array of commands separated by semicolons
export const parseCommand = (inputText) => {
  // Split the prompt by ';' to allow batching
  const rawCommands = inputText.split(';');

  // Parse each one individually and filter out empty ones
  const parsedCommands = rawCommands
    .map(cmd => parseSingleCommand(cmd))
    .filter(cmd => cmd !== null);

  return parsedCommands; // Returns an array of actions!
};
