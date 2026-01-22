export interface Service {
  id: string;
  barbershopId: string;
  name: string;
  description?: string;
  price: number;
  promoPrice?: number;
  durationMinutes: number;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
