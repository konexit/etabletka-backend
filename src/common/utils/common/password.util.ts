import * as bcrypt from 'bcrypt';

export const hashPassword = (plainPassword: string, saltRounds: number = 10): Promise<string> => {
  return bcrypt.hash(plainPassword, saltRounds);
}

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
}