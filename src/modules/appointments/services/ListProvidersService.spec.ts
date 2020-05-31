import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to show the providers without except id', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    const secondUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'loggeduser@example.com',
      password: '1234',
    });

    const providers = await listProviders.execute({});

    expect(providers).toHaveLength(2);
    expect(providers).toEqual([firstUser, secondUser]);
  });

  it('should be able to show the providers with except id', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234',
    });

    const exceptUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'loggeduser@example.com',
      password: '1234',
    });

    const providers = await listProviders.execute({
      except_user_id: exceptUser.id,
    });

    expect(providers).toHaveLength(1);
    expect(providers).toEqual([firstUser]);
  });
});
