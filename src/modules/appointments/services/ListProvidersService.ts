import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  except_user_id?: string | undefined;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUsersRepository,
  ) {}

  public async execute({ except_user_id }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_user_id,
    });

    return users;
  }
}

export default ListProvidersService;
