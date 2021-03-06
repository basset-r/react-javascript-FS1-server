
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import constants from '../constants';

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // Get the jwt token from the head
  const token = req.headers['authorization'] as string;

  let jwtPayload;

  // Try to validate the token and get data
  try {
    jwtPayload = (jwt.verify(token.substring(7, token.length), config.jwtSecret) as any);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // If token is not valid, respond with 401 (unauthorized)
    res.status(401).send({ error: constants.ERROR_INVALID_JWT_TOKEN });
    return;
  }

  // The token is valid for 1 hour
  // We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  // Call the next middleware or controller
  next();
};
