export interface Review {
  id: string;
  barbershopId: string;
  userId: string;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    image: string | null;
    email: string;
  };
}

export interface ReviewRepository {
  getByBarbershop(barbershopId: string): Promise<Review[]>;
  approve(id: string): Promise<void>;
  reject(id: string): Promise<void>; // Or delete
}
