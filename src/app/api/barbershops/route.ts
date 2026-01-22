import { NextResponse } from 'next/server';
import { auth } from '@/modules/users/infrastructure/auth';
import { db } from '@/modules/shared/infrastructure/database/db';
import { barbershops } from '@/modules/shared/infrastructure/database/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const newBarbershop = await db.insert(barbershops).values({
      id: uuidv4(),
      name,
      slug,
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {
        show_public_site: true,
        allow_reviews: true,
        allow_posts: true,
        allow_online_booking: true
      }
    }).returning();

    return NextResponse.json(newBarbershop[0]);
  } catch (error: any) {
    console.error('Error creating barbershop:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
