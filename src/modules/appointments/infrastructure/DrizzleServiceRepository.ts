import { db } from '../../shared/infrastructure/database/db';
import { services } from '../../shared/infrastructure/database/schema';
import { ServiceRepository } from '../domain/ServiceRepository';
import { Service } from '../domain/Service';
import { eq } from 'drizzle-orm';

export class DrizzleServiceRepository implements ServiceRepository {
  async getById(id: string): Promise<Service | null> {
    const [result] = await db.select().from(services).where(eq(services.id, id));
    return result as any;
  }

  async getByBarbershop(barbershopId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.barbershopId, barbershopId)) as any;
  }

  async save(service: Service): Promise<void> {
    await db.insert(services).values(service as any);
  }
}
