import { Request, Response } from 'express';
import { compareSync } from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import User from '../models/User';
import { SecretKey } from '../config/default.json';

interface IUserRequest extends Request {
  body: { name?: string; email?: string; password?: string };
  params: { id?: string };
}

interface IUserResponse extends Response {}

class AuthController {
  public async login(req: IUserRequest, res: IUserResponse) {
    const { email, password } = req.body;
    try {
      if (email && password) {
        const user = await User.findOne({ email });
        if (!user) {
          res.status(400).json({ message: `email ${email} not found` });
        } else {
          const compare = compareSync(password, user.password);
          if (compare) {
            res.status(200).json({
              user,
              token: jsonwebtoken.sign(
                {
                  id: user._id,
                },
                SecretKey,
                { expiresIn: '1d' }
              ),
              username: user.username,
            });
          } else {
            res.status(400).json({ message: 'password not match' });
          }
        }
      } else {
        res.status(400).json({ message: 'please enter all fields not match' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default new AuthController();
