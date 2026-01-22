import { db } from '../../shared/infrastructure/database/db';
import { appointments } from '../../shared/infrastructure/database/schema';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { Appointment } from '../domain/Appointment';
import { eq, and, gte, lte } from 'drizzle-orm';

export class DrizzleAppointmentRepository implements AppointmentRepository {
  async getById(id: string): Promise<Appointment | null> {
    const [result] = await db.select().from(appointments).where(eq(appointments.id, id));
    return result as any;
  }

  async getByBarberAndDate(barberId: string, date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.select().from(appointments).where(
      and(
        eq(appointments.barberId, barberId),
        gte(appointments.startTime, startOfDay),
        lte(appointments.startTime, endOfDay)
      )
    ) as any;
  }

  async getByBranchAndDate(branchId: string, date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.select().from(appointments).where(
      and(
        eq(appointments.branchId, branchId),
        gte(appointments.startTime, startOfDay),
        lte(appointments.startTime, endOfDay)
      )
    ) as any;
  }

  async save(appointment: Appointment): Promise<void> {
    await db.insert(appointments).values(appointment as any);
  }

  async update(appointment: Appointment): Promise<void> {
    await db.update(appointments)
      .set({
        ...appointment,
        updatedAt: new Date(),
      } as any)
      .where(eq(appointments.id, appointment.id));
  }

  async findConflicting(barberId: string, startTime: Date, endTime: Date): Promise<Appointment | null> {
    // Basic overlap logic
    const conflicts = await db.select().from(appointments).where(
      and(
        eq(appointments.barberId, barberId),
        gte(appointments.endTime, startTime),
        lte(appointments.startTime, endTime)
      )
    );
    return (conflicts[0] as any) || null;
  }
}
