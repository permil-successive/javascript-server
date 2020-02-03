import { Router } from 'express';
import Controller from './controller';

const traineeRoutes: Router  = Router();
const { list, create, update, delete: deleteFunction } = Controller;

traineeRoutes.route('/')
.get(list)
.post(create)
.put(update)
.delete(deleteFunction);

export default traineeRoutes;
