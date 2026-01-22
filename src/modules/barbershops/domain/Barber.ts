export interface Barber {
  id: string;
  barbershopId: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  specialty?: string;
  commissionRate: number;
  isActive: boolean;
  branches: string[]; // IDs of branches where the barber works
  createdAt: Date;
  updatedAt: Date;
}
