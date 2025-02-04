import { randomBytes } from 'crypto';



export const generatePickupCode = async (): Promise<string> => {
  const PICKUP_CODE_LENGTH = 6;
  const PICKUP_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';  
  const bytes = randomBytes(PICKUP_CODE_LENGTH);
  let result = '';
  
  for (let i = 0; i < PICKUP_CODE_LENGTH; i++) {
    result += PICKUP_CODE_ALPHABET[bytes[i] % PICKUP_CODE_ALPHABET.length];
  }
  
  return result;
};