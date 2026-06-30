import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { CreateUserDto, UpdateUserDto, UserPublic } from '../types/users.types';

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export const usersService = {
  async findAll(): Promise<UserPublic[]> {
    return prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string): Promise<UserPublic | null> {
    return prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  },

  async create(data: CreateUserDto): Promise<UserPublic> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.password,
      },
      select: USER_SELECT,
    });
  },

  async update(id: string, data: UpdateUserDto): Promise<UserPublic | null> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return null;
    return prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  },

  async remove(id: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.user.delete({ where: { id } });
    return true;
  },

  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user !== null;
  },
};
