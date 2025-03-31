import { authenticate } from '#features/auth/auth.services.js';
import express from 'express';
import { z } from 'zod';

const authRouter = express.Router();

// type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

/* POST AUTHENTICATE START */

const authSchema = z.object({
  email: z.string().email(), // Ensures it's a valid email
  password: z.string().min(8) // Ensures password is non-empty
});

type authSchema = z.infer<typeof authSchema>;

authRouter.post('/authenticate', async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const token = await authenticate(email, password, process.env.JWT_AUTH_TOKEN_SECRET);
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

/* POST AUTHENTICATE END */

export default authRouter;
