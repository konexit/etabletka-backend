import * as bcrypt from 'bcrypt';

export const hashPassword = (plainPassword: string, saltRounds: number = 10): Promise<string> => {
  return bcrypt.hash(plainPassword, saltRounds);
}