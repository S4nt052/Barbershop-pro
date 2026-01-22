import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { reviews } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { eq } from 'drizzle-orm';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

const barbershopRepo = new DrizzleBarbershopRepository();

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { reviewId, isApproved } = body;

    if (!reviewId) {
        return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
    }

    // Verify ownership of the review's barbershop
    // 1. Get review to find barbershopId
    const review = await db.select().from(reviews).where(eq(reviews.id, reviewId)).then(res => res[0]);
    
    if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

    // 2. Verify user owns this barbershop
    const userShop = await barbershopRepo.getByOwnerId(session.user.id);
    if (!userShop || userShop.id !== review.barbershopId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update
    await db.update(reviews)
      .set({
        isApproved: isApproved,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
