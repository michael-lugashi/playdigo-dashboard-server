import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authenticate = async (email: string, password: string, secret: string): Promise<string> => {
  if (email !== process.env.EMAIL) throw new Error('Nonexistent User');
  const match = await bcrypt.compare(password, process.env.HASHED_PASSWORD);
  if (!match) throw new Error('Incorrect credentials.');

  const token = await new Promise<string>((resolve, reject) => {
    jwt.sign({}, secret, { expiresIn: '1h' }, (err: Error | null, token?: string) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      } else if (!token) {
        reject(new Error('Token generation failed'));
      } else {
        resolve(token);
      }
    });
  });

  return token;
};
