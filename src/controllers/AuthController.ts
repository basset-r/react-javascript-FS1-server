import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import config from '../config/config';
import { User } from '../entity/User';
import constants from '../constants';

class AuthController {
  static login = async (req: Request, res: Response) => {

    // Check if username and password are set
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send({ error: constants.ERROR_INVALID_INPUT });
      return;
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
    } catch (error) {
      res.status(401).send({ error: constants.ERROR_INVALID_CREDENTIAL });
      return;
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send({ error: constants.ERROR_INVALID_CREDENTIAL });
      return;
    }

    // Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    // Send the jwt in the response
    res.status(200).send({ token });
  }

  static changePassword = async (req: Request, res: Response) => {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword && newPassword)) {
      res.status(400).send({ error: constants.ERROR_INVALID_INPUT });
      return;
    }

    // Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send({ error: constants.ERROR_INVALID_CREDENTIAL });
      return;
    }

    // Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send({ error: constants.ERROR_INVALID_CREDENTIAL });
      return;
    }

    // Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ error: constants.ERROR_INVALID_NEW_PASSWORD });
      return;
    }
    // Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  }

  static register = async (req: Request, res: Response) => {
    // Get parameters from the body
    const { username, password, role } = req.body;

    if (!(username && password)) {
      res.status(400).send({ error: constants.ERROR_INVALID_INPUT });
      return;
    }

    const userRepository = getRepository(User);
    const user : User = new User();

    user.username = username;
    user.password = password;
    if (role === 'user' || role === 'doctor') {
      user.role = role;
    } else {
      user.role = 'user';
    }

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send({ error: constants.ERROR_INVALID_NEW_PASSWORD });
      return;
    }

    user.hashPassword();
    try {
      userRepository.save(user);
    } catch (err) {
      res.status(500).send({ error: constants.ERROR_UNABLE_TO_CREATE_USER });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' },
    );

    // Send the jwt in the response
    res.status(200).send({ token });
  }
}

export default AuthController;
