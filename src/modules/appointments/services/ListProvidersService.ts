import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id?: string | undefined;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const cacheKey = `providers-list:${user_id}`;
    let users = classToClass(
      await this.cacheProvider.recover<User[]>(cacheKey),
    );

    if (!users) {
      users = classToClass(
        await this.usersRepository.findAllProviders({
          user_id,
        }),
      );

      await this.cacheProvider.save(cacheKey, users);
    }

    return users;
  }
}

export default ListProvidersService;
