import * as crypto from 'crypto';

export const getPasswordWithSHA512 = (purePassword: string, salt: string): string => {
    return crypto.pbkdf2Sync(purePassword, salt, 1000, 64, `sha512`).toString(`hex`);
}