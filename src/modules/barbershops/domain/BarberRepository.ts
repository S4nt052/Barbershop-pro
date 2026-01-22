import { Barber } from './Barber';

export interface BarberRepository {
  getById(id: string): Promise<Barber | null>;
  getByBranch(branchId: string): Promise<Barber[]>;
  getByBarbershop(barbershopId: string): Promise<Barber[]>;
  save(barber: Barber): Promise<void>;
  update(barber: Barber): Promise<void>;
}
