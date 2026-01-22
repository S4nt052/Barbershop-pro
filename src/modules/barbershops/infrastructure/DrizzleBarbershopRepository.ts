import { db } from '../../shared/infrastructure/database/db';
import { barbershops } from '../../shared/infrastructure/database/schema';
import { BarbershopRepository } from '../domain/BarbershopRepository';
import { Barbershop } from '../domain/Barbershop';
import { eq } from 'drizzle-orm';

export class DrizzleBarbershopRepository implements BarbershopRepository {
  async getById(id: string): Promise<Barbershop | null> {
    const [result] = await db.select().from(barbershops).where(eq(barbershops.id, id));
    if (!result) return null;
    
    return {
      ...result,
      settings: result.settings as any,
    };
  }

  async getBySlug(slug: string): Promise<Barbershop | null> {
    const [result] = await db.select().from(barbershops).where(eq(barbershops.slug, slug));
    if (!result) return null;
    
    return {
      ...result,
      settings: result.settings as any,
    };
  }

  async getByOwnerId(ownerId: string): Promise<Barbershop | null> {
    const [result] = await db.select().from(barbershops).where(eq(barbershops.ownerId, ownerId));
    if (!result) return null;
    
    return {
      ...result,
      settings: result.settings as any,
    };
  }

  async save(barbershop: Barbershop): Promise<void> {
    await db.insert(barbershops).values({
      ...barbershop,
      settings: barbershop.settings,
    });
  }

  async update(barbershop: Barbershop): Promise<void> {
    await db.update(barbershops)
      .set({
        ...barbershop,
        settings: barbershop.settings,
        updatedAt: new Date(),
      })
      .where(eq(barbershops.id, barbershop.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(barbershops).where(eq(barbershops.id, id));
  }
}
