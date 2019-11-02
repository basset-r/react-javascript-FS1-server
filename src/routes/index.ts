import { Request, Response, Router, static as Static } from 'express';
import auth from './auth';
import user from './user';
import appointment from './appointment';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/appointment', appointment);
routes.use('/docs', Static(`${process.env.PWD}${process.env.APIDOC_URL}`));

export default routes;
