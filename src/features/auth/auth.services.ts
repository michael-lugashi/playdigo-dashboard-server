import { AuthenticationError, InternalServerError } from '#core/errors/custom.errors.js';
import { getUserByEmail } from '#core/google.sheets/google.sheets.api.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticate = async (email: string, password: string, secret: string): Promise<string> => {
  const user = await getUserByEmail(email);
  if (!user) throw new AuthenticationError('Incorrect credentials.');
  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) throw new AuthenticationError('Incorrect credentials.');

  const token = await new Promise<string>((resolve, reject) => {
    jwt.sign(user, secret, { expiresIn: '1h' }, (err, token) => {
      if (err || !token) {
        reject(new InternalServerError('Token generation failed'));
      } else {
        resolve(token);
      }
    });
  });

  return token;
};
