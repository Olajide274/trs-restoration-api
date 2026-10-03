import prisma from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { isValidTransition } from '../utils/statusTransitions';
import { DamageType, JobStatus } from '@prisma/client';

// Generate sequential job IDs like JOB-001, JOB-002...
async function generateJobId(): Promise<string> {
  const count = await prisma.job.count();
  const nextNumber = (count + 1).toString().padStart(3, '0');
  return `JOB-${nextNumber}`;
}

export async function createJob(data: {
  customerName: string;
  customerEmail: string;
  propertyAddress: string;
  damageType: DamageType;
  damageDescription: string;
  squareFeet: number;
}) {
  const id = await generateJobId();

  const job = await prisma.job.create({
    data: {
      id,
      ...data,
      status: 'NEW',
      estimatedCost: 0,
    },
  });

  return job;
}

export async function getAllJobs(filters: {
  status?: string;
  damageType?: string;
  page?: number;
  limit?: number;
}) {
  const where: any = {};

  if (filters.status) {
    where.status = filters.status as JobStatus;
  }
  if (filters.damageType) {
    where.damageType = filters.damageType as DamageType;
  }

  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
  const skip = (page - 1) * limit;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data: jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(id: string) {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) {
    throw new AppError('Job not found', 404);
  }
  return job;
}

export async function updateJobStatus(id: string, newStatus: string) {
  const job = await getJobById(id);

  if (!isValidTransition(job.status, newStatus)) {
    throw new AppError(
      `Invalid status transition from ${job.status} to ${newStatus}`,
      409
    );
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: { status: newStatus as JobStatus },
  });

  // Simple audit trail
  await prisma.statusHistory.create({
    data: {
      jobId: id,
      fromStatus: job.status,
      toStatus: newStatus,
    },
  });

  return updatedJob;
}

export async function calculateEstimate(
  id: string,
  costs: { laborCost: number; materialCost: number; equipmentCost: number }
) {
  await getJobById(id); // throws 404 if not found

  const estimatedCost =
    costs.laborCost + costs.materialCost + costs.equipmentCost;

  const updatedJob = await prisma.job.update({
    where: { id },
    data: { estimatedCost },
  });

  return { estimatedCost: updatedJob.estimatedCost };
}

export async function generateAiAssessment(id: string) {
  const job = await getJobById(id);

  return {
    jobId: job.id,
    property: {
      address: job.propertyAddress,
      squareFeet: job.squareFeet,
    },
    damage: {
      type: job.damageType,
      description: job.damageDescription,
    },
    currentEstimate: job.estimatedCost,
    instructions:
      'Analyze the reported property damage and suggest appropriate restoration actions.',
  };
}