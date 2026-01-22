export interface Branch {
  id: string;
  barbershopId: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  workingHours: WorkingHours[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkingHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isClosed: boolean;
}
