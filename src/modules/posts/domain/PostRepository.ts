export interface Post {
  id: string;
  barbershopId: string;
  title: string;
  description: string | null;
  imageUrl: string;
  postType: 'corte' | 'promo' | 'evento';
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostRepository {
  getByBarbershop(barbershopId: string): Promise<Post[]>;
  save(post: Post): Promise<void>;
  delete(id: string): Promise<void>;
}
