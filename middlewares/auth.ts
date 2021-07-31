import { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

import { SecretKey } from '../config/default.json';
import User from '../models/User';

interface IRequest extends Request {
  user?: { id: string };
}

const auth = async (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.header('token');
  try {
    if (token) {
      const decoded = jsonwebtoken.verify(token, SecretKey) as { id: string };
      req.user = decoded;
      const user = await User.findOne({ _id: decoded.id });
      user ? next() : res.status(401).json({ message: 'token is not valid' });
    } else {
      res.status(401).json({ message: 'no token, authorization denied' });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default auth;
