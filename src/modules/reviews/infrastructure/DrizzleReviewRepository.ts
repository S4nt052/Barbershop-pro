import { db } from '../../shared/infrastructure/database/db';
import { reviews, users } from '../../shared/infrastructure/database/schema';
import { ReviewRepository, Review } from '../domain/ReviewRepository';
import { eq, desc } from 'drizzle-orm';

export class DrizzleReviewRepository implements ReviewRepository {
  async getByBarbershop(barbershopId: string): Promise<Review[]> {
    const rows = await db.select({
        review: reviews,
        user: users
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.barbershopId, barbershopId))
    .orderBy(desc(reviews.createdAt));

    return rows.map(({ review, user }) => ({
        ...review,
        user: {
            name: user.name,
            email: user.email,
            image: user.image
        },
        imageUrl: review.imageUrl
    })) as Review[];
  }

  async approve(id: string): Promise<void> {
    await db.update(reviews)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(reviews.id, id));
  }

  async reject(id: string): Promise<void> {
     // Usually reject means hide (isApproved=false) or delete.
     // Requirement says "Moderar". We'll toggle approval off or can delete.
     // For now, toggle off.
     await db.update(reviews)
      .set({ isApproved: false, updatedAt: new Date() })
      .where(eq(reviews.id, id));
  }
}
