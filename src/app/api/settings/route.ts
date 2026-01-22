import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { barbershops } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { eq } from 'drizzle-orm';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

const barbershopRepo = new DrizzleBarbershopRepository();

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const barbershopId = body.id;

    if (!barbershopId) {
        return NextResponse.json({ error: 'Missing barbershop ID' }, { status: 400 });
    }

    // Verify ownership
    // Ideally we assume the ID comes from the client form which got it from the server, 
    // but better to fetch the user's shop again to be safe.
    const userShop = await barbershopRepo.getByOwnerId(session.user.id);
    if (!userShop || userShop.id !== barbershopId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update Barbershop
    await db.update(barbershops)
      .set({
        name: body.name,
        description: body.description,
        phone: body.phone,
        address: body.address,
        bannerUrl: body.bannerUrl,
        settings: body.settings, // JSON object with flags
        updatedAt: new Date(),
      })
      .where(eq(barbershops.id, barbershopId));

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
