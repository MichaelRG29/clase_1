import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { RegisterDto, LoginDto, AuthResponse, JwtPayload } from
'../types/auth.types';
import { AppError } from '../helpers/errors';
const SALT_ROUNDS = 10;
export const authService = {
 async register(data: RegisterDto): Promise<AuthResponse> {
 const existing = await prisma.user.findUnique({ where: { email: data.email }
});
  if (existing) throw new AppError(409, 'El email ya está registrado');
 const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
 const user = await prisma.user.create({
 data: { name: data.name, email: data.email, passwordHash },
 select: { id: true, name: true, email: true, createdAt: true },
 });
 const token = generateToken({ userId: user.id, email: user.email });
 return { token, user };
 },
 async login(data: LoginDto): Promise<AuthResponse> {
 const user = await prisma.user.findUnique({ where: { email: data.email } });
 // Mensaje genérico: no revelar si el email existe o no
 const INVALID = 'Credenciales inválidas';
  if (!user) throw new AppError(401, INVALID);
  const match = await bcrypt.compare(data.password, user.passwordHash);
  if (!match) throw new AppError(401, INVALID);
 const token = generateToken({ userId: user.id, email: user.email });
 return { token, user: { id: user.id, name: user.name, email: user.email } };
 },
};
function generateToken(payload: JwtPayload): string {
 return jwt.sign(payload, process.env.JWT_SECRET!, {
 expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as any,
 });
}