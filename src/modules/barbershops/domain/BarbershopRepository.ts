import { Barbershop } from './Barbershop';

export interface BarbershopRepository {
  getById(id: string): Promise<Barbershop | null>;
  getBySlug(slug: string): Promise<Barbershop | null>;
  getByOwnerId(ownerId: string): Promise<Barbershop | null>;
  save(barbershop: Barbershop): Promise<void>;
  update(barbershop: Barbershop): Promise<void>;
  delete(id: string): Promise<void>;
}
