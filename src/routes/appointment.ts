import { Router } from 'express';
import AppointmentController from '../controllers/AppointmentController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

/**
 * @api {post} /appointment Create new appointment
 * @apiName CreateAppointment
 * @apiGroup appointment
 * @apiPermission User
 *
 * @apiHeader {String} BearerToken User access token
 *
 * @apiParam {Date} startAt Start datetime of the appointment
 * @apiParam {Date} endAt End datetime of the appointment
 * @apiParam {Int} doctorId Id of the doctor
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      startAt: "2019-08-16T12:00:00.000Z",
 *      endAt: "2019-08-16T14:00:00.000Z",
 *      doctor: 3,
 *      patient: 2,
 *      isValidated: false,
 *      id: 4
 *    }
 *
 * @apiError InvalidInput Invalid paramaters
 * @apiError BadRequest 400 Invalid date
 * @apiError NotFound 404 doctor not found
 * @apiError Internal Cannot create user
 *
 */
router.post('/create', [checkJwt], AppointmentController.create);

/**
 * @api {post} /appointment/:id Get list of appointment of a USer
 * @apiName GetAppointment
 * @apiGroup appointment
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
 * @apiError BadRequest 400 Not a doctor id
 *
 */
router.get('/:id([0-9]+)', [checkJwt], AppointmentController.getAppointments);

/**
 * @api {post} /appointment/validate Validate an appointment
 * @apiName ValidateAppointment
 * @apiGroup appointment
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
 * @apiError NotFound 404 Appointment not found
 * @apiError Unauthorized 401 You must be the doctor of the appointment to validate
 *
 */
router.post('/validate', [checkJwt], AppointmentController.validate);

/**
 * @api {post} /appointment/:id Delete an appointment
 * @apiName DeleteAppointment
 * @apiGroup appointment
 * @apiPermission User
 *
 * @apiHeader {String} BearerToken User access token
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *    }
 *
 * @apiError NotFound 404 Invalid id
 *
 */
router.delete('/:id([0-9]+)', [checkJwt], AppointmentController.delete);

export default router;
