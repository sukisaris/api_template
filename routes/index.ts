import express from 'express';

const routes = express.Router();

import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import auth from '../middlewares/auth';

routes.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Hello' });
});

// auth controller
routes.post('/auth/login', AuthController.login);

// user controller
routes.post('/users', UserController.create);
routes.get('/users', UserController.readAll);
routes.get('/users/:id', UserController.read);
routes.put('/users/:id', auth, UserController.update);
routes.delete('/users/:id', auth, UserController.delete);

export default routes;
