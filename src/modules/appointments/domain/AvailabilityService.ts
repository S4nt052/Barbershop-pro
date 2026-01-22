import { Appointment } from './Appointment';
import { Service } from './Service';
import { Barber } from '../../barbershops/domain/Barber';
import { Branch } from '../../barbershops/domain/Branch';

export class AvailabilityService {
  static isBarberAvailable(
    barber: Barber,
    branch: Branch,
    startTime: Date,
    endTime: Date,
    existingAppointments: Appointment[],
    bufferMinutes: number = 0
  ): boolean {
    // 1. Check branch working hours
    if (!this.isWithinBranchHours(branch, startTime, endTime)) {
      return false;
    }

    // 2. Check barber schedule
    if (!this.isWithinBarberSchedule(barber, startTime, endTime)) {
      return false;
    }

    // 3. Check for conflicts with existing appointments (including buffer)
    const hasConflict = existingAppointments.some(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      
      // Add buffer to existing appointment end time
      const aptEndWithBuffer = new Date(aptEnd.getTime() + bufferMinutes * 60000);
      // Also add buffer BEFORE the current request
      const requestStartWithBuffer = new Date(startTime.getTime() - bufferMinutes * 60000);

      return (startTime < aptEndWithBuffer && endTime > aptStart);
    });

    return !hasConflict;
  }

  private static isWithinBranchHours(branch: Branch, start: Date, end: Date): boolean {
    const day = start.getDay();
    const hours = branch.workingHours.find(h => h.dayOfWeek === day);
    
    if (!hours || hours.isClosed) return false;

    const startStr = this.dateToTimeString(start);
    const endStr = this.dateToTimeString(end);

    return startStr >= hours.openTime && endStr <= hours.closeTime;
  }

  private static isWithinBarberSchedule(barber: Barber, start: Date, end: Date): boolean {
    // This could be more complex (breaks, etc.)
    // For now simple active check and generic schedule
    return barber.isActive;
  }

  private static dateToTimeString(date: Date): string {
    return date.toTimeString().substring(0, 5); // HH:mm
  }
}
