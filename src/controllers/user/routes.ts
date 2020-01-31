import { Router } from 'express';
import Controller from './controller';

const userRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;

userRoutes.route('/')
.get(list)
.post(create)
.put(update)
.delete(deleteFunction);

export default userRoutes;
