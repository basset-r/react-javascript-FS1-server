import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

/**
 * @api {post} /auth/login Login user
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiPermission Public
 *
 * @apiParam {String{4..20}} username User name
 * @apiParam {String{4..100}} password User password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "Token": "JWT-token"
 *     }
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError InvalidCredential Invalid email/password
 *
 */
router.post('/login', AuthController.login);

/**
 * @api {post} /auth/change-password Change user password
 * @apiName ChangeUserPassword
 * @apiGroup Auth
 * @apiPermission User
 *
 * @apiHeader {String} BearerToken User access token
 *
 * @apiParam {String{4..100}} oldPassword User old password
 * @apiParam {String{4..100}} newPassword User new password
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 204 No Content
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError InvalidCredential Invalid email/password
 * @apiError InvalidNewPassword New password is invalid
 *
 */
router.post('/change-password', [checkJwt], AuthController.changePassword);

/**
 * @api {post} /auth/register Register user
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission Public
 *
 * @apiParam {String{4..20}} username Username
 * @apiParam {String{4..100}} password User password
 * @apiParam {String="doctor","user"} role User role
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "Token": "JWT-token"
 *     }
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError Internal Cannot create user
 *
 */
router.post('/register', AuthController.register);

export default router;
