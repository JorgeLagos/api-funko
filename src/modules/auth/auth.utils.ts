import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { IUser } from '../../models/user.model';

export function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id:    user._id,
      email: user.email,
      name:  user.name,
      role:  user.role,
      avatar: user.avatar,
    },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
