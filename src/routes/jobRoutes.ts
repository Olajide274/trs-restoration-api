import { Router } from 'express';
import * as jobController from '../controllers/jobController';
import { validate } from '../middleware/validate';
import {
  createJobSchema,
  updateStatusSchema,
  estimateSchema,
} from '../utils/jobSchemas';

const router = Router();

router.post('/', validate(createJobSchema), jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.patch('/:id/status', validate(updateStatusSchema), jobController.updateJobStatus);
router.post('/:id/estimate', validate(estimateSchema), jobController.calculateEstimate);
router.post('/:id/ai-assessment', jobController.generateAiAssessment);

export default router;