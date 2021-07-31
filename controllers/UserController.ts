import { Request, Response } from 'express';
import User from '../models/User';
import { hashSync, genSaltSync } from 'bcrypt';

import IController from '../props/controller';

interface IUserRequest extends Request {
  body: { name?: string; email?: string; password?: string };
  params: { id?: string };
  user?: { id: string };
}

interface IUserResponse extends Response {}

class UserController implements IController {
  public async create(req: IUserRequest, res: IUserResponse) {
    const { name, email, password } = req.body;
    try {
      if (name && email && password) {
        const user = new User({ name, email, password: hashSync(password, genSaltSync(10)) });
        await user.save();
        res.status(201).json({ user });
      } else {
        res.status(501).json({ message: 'please enter all fields' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async read(req: IUserRequest, res: IUserResponse) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async readAll(req: IUserRequest, res: IUserResponse) {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async update(req: IUserRequest, res: IUserResponse) {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      if (req.user && req.user.id === id) {
        const user = await User.findById(id);
        name && (user.name = name);
        email && (user.email = email);
        await user.save();
        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: 'authorization denied' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async delete(req: IUserRequest, res: IUserResponse) {
    const { id } = req.params;
    try {
      if (req.user && req.user.id === id) {
        const user = await User.deleteOne({ _id: id });
        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: 'authorization denied' });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default new UserController();
