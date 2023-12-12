const numbers = "1234567890";
export const matchNumber = (char: string | undefined) => char && numbers.includes(char) ? char : null;
