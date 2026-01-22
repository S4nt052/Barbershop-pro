import { Appointment } from './Appointment';

export interface AppointmentRepository {
  getById(id: string): Promise<Appointment | null>;
  getByBarberAndDate(barberId: string, date: Date): Promise<Appointment[]>;
  getByBranchAndDate(branchId: string, date: Date): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
  findConflicting(barberId: string, startTime: Date, endTime: Date): Promise<Appointment | null>;
}
