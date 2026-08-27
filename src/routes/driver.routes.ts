import { Router } from 'express';
import { driverController } from '../controllers/driver.controller';
import { validate } from '../middlewares/validate';
import { createDriverSchema, updateDriverSchema } from '../schemas/driver.schema';

const router = Router();

router.post('/', validate(createDriverSchema), driverController.create);
router.get('/', driverController.findAll);
router.get('/:id', driverController.findById);
router.put('/:id', validate(updateDriverSchema), driverController.update);
router.delete('/:id', driverController.delete);

export { router as driverRoutes };
