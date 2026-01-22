import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { posts } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { eq } from 'drizzle-orm';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

const barbershopRepo = new DrizzleBarbershopRepository();

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const postId = params.id;
    if (!postId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // Validate Ownership
    const post = await db.select().from(posts).where(eq(posts.id, postId)).then(res => res[0]);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const barbershop = await barbershopRepo.getByOwnerId(session.user.id);
    if (!barbershop || barbershop.id !== post.barbershopId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await db.delete(posts).where(eq(posts.id, postId));

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
