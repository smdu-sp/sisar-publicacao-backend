import { Usuario } from '_prisma/main/client';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: Usuario;
}
