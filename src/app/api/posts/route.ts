import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { posts } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { v4 as uuidv4 } from 'uuid';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

const barbershopRepo = new DrizzleBarbershopRepository();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Validate Barbershop Ownership
    let barbershopId = body.barbershop_id;
    if (!barbershopId) {
        const barbershop = await barbershopRepo.getByOwnerId(session.user.id);
        if (!barbershop) return NextResponse.json({ error: 'No barbershop found' }, { status: 404 });
        barbershopId = barbershop.id;
    }

    const newPost = await db.insert(posts).values({
        id: uuidv4(),
        barbershopId: barbershopId,
        title: body.title,
        description: body.description,
        imageUrl: body.image_url,
        postType: body.post_type || 'corte',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    return NextResponse.json(newPost[0]);

  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        
        const { eq } = await import('drizzle-orm');
        await db.update(posts).set({
            title: body.title,
            description: body.description,
            postType: body.post_type,
            imageUrl: body.image_url,
            updatedAt: new Date()
        }).where(eq(posts.id, body.id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
