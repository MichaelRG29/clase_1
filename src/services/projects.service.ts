import prisma from '../config/prisma';
import { CreateProjectDto, UpdateProjectDto, ProjectPublic } from '../types/projects.types';

const PROJECT_SELECT = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  createdAt: true,
} as const;

export const projectsService = {
  async findAll(): Promise<ProjectPublic[]> {
    return prisma.project.findMany({
      select: PROJECT_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string): Promise<ProjectPublic | null> {
    return prisma.project.findUnique({
      where: { id },
      select: PROJECT_SELECT,
    });
  },

  async findByOwner(ownerId: string): Promise<ProjectPublic[]> {
    return prisma.project.findMany({
      where: { ownerId },
      select: PROJECT_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(data: CreateProjectDto): Promise<ProjectPublic> {
    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      },
      select: PROJECT_SELECT,
    });
  },

  async update(id: string, data: UpdateProjectDto): Promise<ProjectPublic | null> {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return null;
    return prisma.project.update({
      where: { id },
      data,
      select: PROJECT_SELECT,
    });
  },

  async remove(id: string): Promise<boolean> {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return false;
    await prisma.project.delete({ where: { id } });
    return true;
  },
};
