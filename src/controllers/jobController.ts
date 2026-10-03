import { Request, Response, NextFunction } from 'express';
import * as jobService from '../services/jobService';

export async function createJob(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

export async function getAllJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, damageType, page, limit } = req.query;

    const result = await jobService.getAllJobs({
      status: status as string | undefined,
      damageType: damageType as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getJobById(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

export async function updateJobStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobService.updateJobStatus(req.params.id, req.body.status);
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
}

export async function calculateEstimate(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await jobService.calculateEstimate(req.params.id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function generateAiAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = await jobService.generateAiAssessment(req.params.id);
    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
}