import { AuthenticationError, InternalServerError } from '#core/errors/custom.errors.js';
import { getUserByEmail } from '#core/google.sheets/google.sheets.users.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticate = async (
  email: string,
  password: string,
  secret: string
): Promise<{ institutionName: string; role: string; token: string }> => {
  const user = await getUserByEmail(email);
  if (!user) throw new AuthenticationError('Incorrect credentials.');
  const match = await bcrypt.compare(password, user.hashedPassword);
  if (!match) throw new AuthenticationError('Incorrect credentials.');

  const tokenData = {
    institutionServiceName: user.institutionServiceName,
    role: user.role,
    userId: user.id
  };

  const token = await new Promise<string>((resolve, reject) => {
    jwt.sign(tokenData, secret, { expiresIn: '1h' }, (err, token) => {
      if (err || !token) {
        reject(new InternalServerError('Token generation failed'));
      } else {
        resolve(token);
      }
    });
  });

  return { institutionName: user.institutionPrettyName, role: user.role, token };
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
