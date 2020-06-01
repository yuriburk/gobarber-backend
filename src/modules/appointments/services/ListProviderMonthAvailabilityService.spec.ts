import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const promises = [];
    for (let i = 0; i <= 10; i += 1) {
      promises.push(
        fakeAppointmentsRepository.create({
          provider_id: 'provider-id',
          user_id: 'user-id',
          date: new Date(2020, 4, 21, i, 0, 0),
        }),
      );
    }

    await Promise.all(promises);

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider-id',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 19,
          available: true,
        },
        {
          day: 20,
          available: true,
        },
        {
          day: 21,
          available: false,
        },
        {
          day: 22,
          available: true,
        },
      ]),
    );
  });
});
