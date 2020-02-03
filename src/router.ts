import { Router } from 'express';
import trainee from './controllers/trainee';
import user from './controllers/user';

const mainRouter: Router = Router();

mainRouter.use('/trainee', trainee);
mainRouter.use('/user', user);

export default mainRouter;
