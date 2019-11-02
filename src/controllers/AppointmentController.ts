import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import constants from '../constants';
import { Appointment } from '../entity/Appointment';

class AppointmentController {
  static create = async (req: Request, res: Response) => {
    const { startAt, endAt, doctorId } = req.body;
    const userRepository = getRepository(User);
    const appointmentRepository = getRepository(Appointment);
    const appointment : Appointment = new Appointment();
    const userId = parseInt(res.locals.jwtPayload.userId, 10);

    try {
      appointment.startAt = new Date(startAt);
    } catch (err) {
      res.status(400).send({ error: constants.ERROR_START_AT_DATE });
      return;
    }

    try {
      appointment.endAt = new Date(endAt);
    } catch (err) {
      res.status(400).send({ error: constants.ERROR_END_AT_DATA });
      return;
    }

    try {
      await userRepository.findOneOrFail({
        where: {
          id: doctorId,
          role: 'doctor',
        },
      });
      appointment.doctor = doctorId;
    } catch (error) {
      res.status(404).send({ error: constants.ERROR_USER_NOT_FOUND });
      return;
    }

    try {
      await userRepository.findOneOrFail(userId);
      appointment.patient = userId;
    } catch (error) {
      res.status(404).send({ error: constants.ERROR_USER_NOT_FOUND });
      return;
    }

    appointment.isValidated = false;
    // send the db object, not one generated in controller
    const appointmentObject = await appointmentRepository.save(appointment);
    res.status(201).send(appointmentObject);
  }

  static validate = async (req: Request, res: Response) => {
    const { appointmentId } = req.body;
    const appointmentRepository = getRepository(Appointment);
    const userId = res.locals.jwtPayload.userId;

    let appointment : Appointment;
    try {
      appointment = await appointmentRepository.findOneOrFail(appointmentId);
    } catch (err) {
      res.status(404).send({ error: constants.ERROR_APPOINTMENT_NOT_FOUND });
      return;
    }

    if (appointment.doctor.toString() !== userId.toString()) {
      res.status(401).send({ error: constants.ERROR_APPOINTMENT_NOT_OWN });
      return;
    }

    appointment.isValidated = true;
    appointmentRepository.save(appointment);
    res.status(204).send();
  }

  static getAppointments = async (req: Request, res: Response) => {
    const doctorId: number = parseInt(req.params.id, 10);
    const appointmentRepository = getRepository(Appointment);
    const userRepository = getRepository(User);

    // check if user exist and is a doctor
    try {
      await userRepository.findOneOrFail({
        where: {
          id: doctorId,
          role: 'doctor',
        },
      });
    } catch (err) {
      res.status(401).send({ error: constants.ERROR_INVALID_DOCTOR });
      return;
    }

    // get list of appointments
    const appointments = await appointmentRepository.find({
      where: {
        doctor: doctorId,
      },
      order: {
        startAt: 'DESC',
      },
    });

    res.status(200).send(appointments);
  }

  static delete = async (req: Request, res: Response) => {
    const appointmentId: number = parseInt(req.params.id, 10);
    const userId = res.locals.jwtPayload.userId;
    const appointmentRepository = getRepository(Appointment);

    let appointment : Appointment;
    try {
      appointment = await appointmentRepository.findOneOrFail(appointmentId);
    } catch (err) {
      res.status(404).send({ error: constants.ERROR_APPOINTMENT_NOT_FOUND });
      return;
    }

    if (appointment.doctor.toString() !== userId.toString()
      && appointment.patient.toString() !== userId.toString()) {
      res.status(401).send({ error: constants.ERROR_UNAUTHORIZED_APPOINTMENT_DELETE });
      return;
    }

    appointmentRepository.delete(appointmentId);
    res.status(200).send();
  }
}

export default AppointmentController;
