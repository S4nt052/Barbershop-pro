import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { services } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

// Initialize repo to get barbershopId from owner
const barbershopRepo = new DrizzleBarbershopRepository();

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Auto-detect barbershop from session if not provided, or validate ownership
    let barbershopId = body.barbershop_id;
    if (!barbershopId) {
        // Find the barbershop owned by this user
        const barbershop = await barbershopRepo.getByOwnerId(session.user.id);
        if (!barbershop) {
             return NextResponse.json({ error: 'No barbershop found for this user' }, { status: 404 });
        }
        barbershopId = barbershop.id;
    }

    const newService = await db.insert(services).values({
      id: uuidv4(),
      barbershopId: barbershopId,
      name: body.name,
      description: body.description,
      category: body.category || 'cortes',
      price: body.price,
      durationMinutes: body.duration,
      promoPrice: body.promo_price || null,
      isActive: body.is_active ?? true,
      imageUrl: body.image_url,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(newService[0]);
  } catch (error: any) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        
        await db.update(services).set({
            name: body.name,
            description: body.description,
            price: body.price,
            durationMinutes: body.duration,
            promoPrice: body.promo_price,
            category: body.category,
            imageUrl: body.image_url,
            isActive: body.is_active,
            updatedAt: new Date()
        }).where(eq(services.id, body.id));

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
