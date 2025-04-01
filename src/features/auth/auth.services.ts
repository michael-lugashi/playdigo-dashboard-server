import { AuthenticationError, InternalServerError } from '#core/errors/custom.errors.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticate = async (email: string, password: string, secret: string): Promise<string> => {
  if (email !== process.env.EMAIL) throw new AuthenticationError('Incorrect credentials.');
  const match = await bcrypt.compare(password, process.env.HASHED_PASSWORD);
  if (!match) throw new AuthenticationError('Incorrect credentials.');

  const token = await new Promise<string>((resolve, reject) => {
    jwt.sign({}, secret, { expiresIn: '1h' }, (err, token) => {
      if (err || !token) {
        reject(new InternalServerError('Token generation failed'));
      } else {
        resolve(token);
      }
    });
  });

  return token;
};
