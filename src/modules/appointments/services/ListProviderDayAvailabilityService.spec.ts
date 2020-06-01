import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 21, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 4, 21, 14, 0, 0),
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => new Date(2020, 4, 21, 11).getTime());

    const availability = await listProviderDayAvailability.execute({
      provider_id: 'provider-id',
      day: 21,
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: false,
        },
        {
          hour: 9,
          available: false,
        },
        {
          hour: 10,
          available: false,
        },
        {
          hour: 11,
          available: false,
        },
        {
          hour: 12,
          available: true,
        },
        {
          hour: 13,
          available: false,
        },
        {
          hour: 14,
          available: false,
        },
        {
          hour: 15,
          available: true,
        },
      ]),
    );
  });
});
