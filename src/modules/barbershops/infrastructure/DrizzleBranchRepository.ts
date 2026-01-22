import { db } from '../../shared/infrastructure/database/db';
import { branches } from '../../shared/infrastructure/database/schema';
import { BranchRepository } from '../domain/BranchRepository';
import { Branch } from '../domain/Branch';
import { eq } from 'drizzle-orm';

export class DrizzleBranchRepository implements BranchRepository {
  async getById(id: string): Promise<Branch | null> {
    const [result] = await db.select().from(branches).where(eq(branches.id, id));
    if (!result) return null;
    return {
      ...result,
      workingHours: result.hours as any,
    } as any;
  }

  async getByBarbershop(barbershopId: string): Promise<Branch[]> {
    const results = await db.select().from(branches).where(eq(branches.barbershopId, barbershopId));
    return results.map(r => ({
      ...r,
      workingHours: r.hours as any,
    })) as any;
  }

  async save(branch: Branch): Promise<void> {
    await db.insert(branches).values({
      ...branch,
      hours: branch.workingHours as any,
    } as any);
  }
}
