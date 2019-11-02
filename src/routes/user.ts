import { Router } from 'express';
import UserController from '../controllers/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

/**
 * @api {get} /user/:id Get user
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission User
 *
 * @apiHeader {String} BearerToken User access token
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "id": 2,
 *      "username": "toto",
 *      "role": "user"
 *    }
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError Internal Cannot create user
 *
 */
router.get('/:id([0-9]+)', [checkJwt], UserController.getOneById);

/**
 * @api {get} /user Get all doctor
 * @apiName GetAllDoctor
 * @apiGroup User
 * @apiPermission User
 *
 * @apiHeader {String} BearerToken User access token
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "id": 1,
 *      "username": "admin",
 *      "role": "doctor"
 *    },
 *    {
 *      "id": 2,
 *      "username": "toto",
 *      "role": "doctor"
 *    }
 *  ]
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError Internal Cannot create user
 *
 */
router.get('/', [checkJwt], UserController.listAll);

export default router;
