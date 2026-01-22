import { db } from '../../shared/infrastructure/database/db';
import { barbers } from '../../shared/infrastructure/database/schema';
import { BarberRepository } from '../domain/BarberRepository';
import { Barber } from '../domain/Barber';
import { eq } from 'drizzle-orm';

export class DrizzleBarberRepository implements BarberRepository {
  async getById(id: string): Promise<Barber | null> {
    const [result] = await db.select().from(barbers).where(eq(barbers.id, id));
    if (!result) return null;
    return {
      ...result,
      branches: result.schedule as any, // Adjust mapping as needed
    } as any;
  }

  async getByBranch(branchId: string): Promise<Barber[]> {
    // This needs a many-to-many or a JSON check in SQLite
    // For simplicity, let's say we filter in memory or use a join table later
    const all = await db.select().from(barbers);
    return all.filter(b => (b.schedule as any)?.branches?.includes(branchId)) as any;
  }

  async getByBarbershop(barbershopId: string): Promise<Barber[]> {
    return await db.select().from(barbers).where(eq(barbers.barbershopId, barbershopId)) as any;
  }

  async save(barber: Barber): Promise<void> {
    await db.insert(barbers).values({
      ...barber,
      commissionRate: barber.commissionRate,
      schedule: barber.branches as any, // Simple mapping for now
    } as any);
  }

  async update(barber: Barber): Promise<void> {
    await db.update(barbers)
      .set({
        ...barber,
        updatedAt: new Date(),
      } as any)
      .where(eq(barbers.id, barber.id));
  }
}
