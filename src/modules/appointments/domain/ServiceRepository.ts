import { Service } from './Service';

export interface ServiceRepository {
  getById(id: string): Promise<Service | null>;
  getByBarbershop(barbershopId: string): Promise<Service[]>;
  save(service: Service): Promise<void>;
}
