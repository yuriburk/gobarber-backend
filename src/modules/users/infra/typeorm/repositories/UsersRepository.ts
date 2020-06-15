import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { id },
    });

    return userFound;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userFound = await this.ormRepository.findOne({
      where: { email },
    });

    return userFound;
  }

  public async findAllProviders({
    user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (user_id) {
      return this.ormRepository.find({
        where: {
          id: Not(user_id),
        },
      });
    }

    return this.ormRepository.find();
  }

  public async isEmailInUse(user_id: string, email: string): Promise<boolean> {
    return (
      (await this.ormRepository.findOne({
        where: { id: Not(user_id), email },
      })) !== undefined
    );
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
