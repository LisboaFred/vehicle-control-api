import { Router } from 'express';
import { automobileController } from '../controllers/automobile.controller';
import { validate } from '../middlewares/validate';
import { createAutomobileSchema, updateAutomobileSchema } from '../schemas/automobile.schema';

const router = Router();

router.post('/', validate(createAutomobileSchema), automobileController.create);
router.get('/', automobileController.findAll);
router.get('/:id', automobileController.findById);
router.put('/:id', validate(updateAutomobileSchema), automobileController.update);
router.delete('/:id', automobileController.delete);

export { router as automobileRoutes };
