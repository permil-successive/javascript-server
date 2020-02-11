import { Router } from 'express';
import { traineeRoutes } from './controllers/trainee';
import { userRoutes } from './controllers/user';

const mainRouter: Router = Router();

mainRouter.use('/trainee', traineeRoutes);
mainRouter.use('/user', userRoutes);

export default mainRouter;
