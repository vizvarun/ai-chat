/**
 * Generates a random chat ID in the format "TC" followed by 6 digits
 */
export const generateChatId = (): string => {
  const randomNum = Math.floor(Math.random() * 1000000);
  return `TC${randomNum.toString().padStart(6, "0")}`;
};
