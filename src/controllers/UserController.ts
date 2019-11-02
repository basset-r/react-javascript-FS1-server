
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entity/User';
import constants from '../constants';

class UserController{

  static listAll = async (req: Request, res: Response) => {

    // Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'username', 'role'],
      where: { role: 'doctor' },
    });

    res.send(users);
  }

  static getOneById = async (req: Request, res: Response) => {

    const id: number = parseInt(req.params.id, 10);

    // Get the user from database
    const userRepository = getRepository(User);
    let user : User;
    try {
      user = await userRepository.findOneOrFail(id, {
        select: ['id', 'username', 'role'],
        where: { role: 'doctor' },
      });
    } catch (error) {
      res.status(404).send({ error: constants.ERROR_USER_NOT_FOUND });
      return;
    }

    res.status(200).send(user);
  }
}

export default UserController;
