import { UserRole } from '../models/user.model';

/** Payload decodificado del JWT */
export interface JwtPayload {
  id:     string;
  email:  string;
  name:   string;
  role:   UserRole;
  avatar: string;
}

// Extiende la interfaz Request de Express con el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      authUser?: JwtPayload;
    }
  }
}
