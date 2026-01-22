import { Appointment, AppointmentStatus } from '../domain/Appointment';
import { AppointmentRepository } from '../domain/AppointmentRepository';
import { AvailabilityService } from '../domain/AvailabilityService';
import { Service } from '../domain/Service';
import { Barber } from '../../barbershops/domain/Barber';
import { Branch } from '../../barbershops/domain/Branch';
import { v4 as uuidv4 } from 'uuid';

export interface BookAppointmentRequest {
  barbershopId: string;
  branchId: string;
  serviceId: string;
  clientId: string;
  startTime: Date;
  barberId?: string; // Optional for "Any barber"
  notes?: string;
}

export class BookAppointmentUseCase {
  constructor(
    private appointmentRepo: AppointmentRepository,
    private barberRepo: any, // To be defined
    private branchRepo: any,   // To be defined
    private serviceRepo: any   // To be defined
  ) {}

  async execute(request: BookAppointmentRequest): Promise<Appointment> {
    const service = await this.serviceRepo.getById(request.serviceId);
    if (!service) throw new Error("Service not found");

    const branch = await this.branchRepo.getById(request.branchId);
    if (!branch) throw new Error("Branch not found");

    const endTime = new Date(request.startTime.getTime() + service.durationMinutes * 60000);
    
    let selectedBarberId = request.barberId;

    if (!selectedBarberId) {
      // Find any available barber
      const availableBarbers = await this.findAvailableBarbers(branch, request.startTime, endTime);
      if (availableBarbers.length === 0) {
        throw new Error("No available barbers for this time slot");
      }
      // Simple strategy: first available or random
      selectedBarberId = availableBarbers[0].id;
    } else {
      const barber = await this.barberRepo.getById(selectedBarberId);
      const existingAppts = await this.appointmentRepo.getByBarberAndDate(selectedBarberId, request.startTime);
      
      const isAvailable = AvailabilityService.isBarberAvailable(
        barber,
        branch,
        request.startTime,
        endTime,
        existingAppts,
        10 // 10 min buffer
      );

      if (!isAvailable) {
        throw new Error("Barber is not available at this time");
      }
    }

    const appointment: Appointment = {
      id: uuidv4(),
      barbershopId: request.barbershopId,
      branchId: request.branchId,
      barberId: selectedBarberId!,
      clientId: request.clientId,
      serviceId: request.serviceId,
      startTime: request.startTime,
      endTime,
      status: 'pending',
      notes: request.notes,
      totalPrice: service.promoPrice || service.price,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.appointmentRepo.save(appointment);
    return appointment;
  }

  private async findAvailableBarbers(branch: Branch, start: Date, end: Date): Promise<Barber[]> {
    const barbers = await this.barberRepo.getByBranch(branch.id);
    const available = [];

    for (const barber of barbers) {
      const existing = await this.appointmentRepo.getByBarberAndDate(barber.id, start);
      if (AvailabilityService.isBarberAvailable(barber, branch, start, end, existing, 10)) {
        available.push(barber);
      }
    }

    return available;
  }
}
