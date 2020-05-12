import { compare } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';
import authConfig from '../../../config/auth';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(email);

    if (!user) {
      throw this.generateError();
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw this.generateError();
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }

  private generateError(): AppError {
    return new AppError('Incorrect email/password combination.', 401);
  }
}

export default AuthenticateUserService;
