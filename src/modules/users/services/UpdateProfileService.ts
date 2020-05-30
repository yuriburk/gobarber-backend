import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    if (
      user.email !== email &&
      (await this.usersRepository.isEmailInUse(user_id, email))
    ) {
      throw new AppError('E-mail already in use');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!old_password) {
        throw new AppError('No old password informed');
      } else {
        const checkOldPassword = await this.hashProvider.compareHash(
          old_password,
          user.password,
        );

        if (!checkOldPassword) {
          throw new AppError('Old password does not match');
        }
      }

      user.password = password;
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
