import { db } from '../../shared/infrastructure/database/db';
import { posts } from '../../shared/infrastructure/database/schema';
import { PostRepository, Post } from '../domain/PostRepository';
import { eq, desc } from 'drizzle-orm';

export class DrizzlePostRepository implements PostRepository {
  async getByBarbershop(barbershopId: string): Promise<Post[]> {
    const result = await db.select()
        .from(posts)
        .where(eq(posts.barbershopId, barbershopId))
        .orderBy(desc(posts.createdAt));
    
    return result as any;
  }

  async save(post: Post): Promise<void> {
    await db.insert(posts).values({
        ...post,
        postType: post.postType as any // Enum casting
    } as any);
  }

  async delete(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }
}
