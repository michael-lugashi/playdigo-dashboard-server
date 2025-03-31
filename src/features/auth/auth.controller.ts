import { authenticate } from '#features/auth/auth.services.js';
import { AuthSchema } from '#features/auth/auth.validation.js';
import { ExpressHandler } from '#interfaces/global.types.js';

export const authController: ExpressHandler<AuthSchema> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authenticate(email, password, process.env.JWT_AUTH_TOKEN_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
