import { Router } from 'express';
import { usageController } from '../controllers/usage.controller';
import { validate } from '../middlewares/validate';
import { createUsageSchema } from '../schemas/usage.schema';

const router = Router();

router.post('/', validate(createUsageSchema), usageController.create);
router.patch('/:id/finish', usageController.finish);
router.get('/', usageController.findAll);

export { router as usageRoutes };
