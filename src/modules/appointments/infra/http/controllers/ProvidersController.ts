import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const except_user_id = request.user.id;
    const listProviders = container.resolve(ListProvidersService);

    const appointment = await listProviders.execute({
      except_user_id,
    });

    return response.json(appointment);
  }
}