export type AppointmentStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'no-show' | 'completed';

export interface Appointment {
  id: string;
  barbershopId: string;
  branchId: string;
  barberId: string;
  clientId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
