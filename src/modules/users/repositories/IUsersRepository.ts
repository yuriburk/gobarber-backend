import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  isEmailInUse(user_id: string, email: string): Promise<boolean>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
