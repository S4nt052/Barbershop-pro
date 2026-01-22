import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { users, barbers } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
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

    // 1. Check if user exists
    let userId: string;
    const existingUser = await db.select().from(users).where(eq(users.email, body.email)).then(res => res[0]);

    if (existingUser) {
        userId = existingUser.id;
        // Optionally upgrade role or check if already a barber
        // For now, allow same user to be barber in multiple places if we supported that (but schema links barber to one shop technically via barber entity)
        // We will just use this user.
    } else {
        // 2. Create User
        userId = uuidv4();
        await db.insert(users).values({
            id: userId,
            email: body.email,
            name: body.name,
            role: body.role || 'barber',
            image: body.avatar_url, // Synchronize avatar to user table
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Note: Password is not set here. In real app, trigger "Reset Password" email or set temp password.
        // Better-Auth might handle this differnetly, but direct DB insert works for basic setup.
    }

    // 3. Create Barber Profile
    const newBarber = await db.insert(barbers).values({
        id: uuidv4(),
        barbershopId: barbershopId,
        userId: userId,
        name: body.name,
        specialty: body.specialty || 'general',
        commissionRate: body.commission_rate || 0.5,
        avatarUrl: body.avatar_url,
        schedule: {}, // Default empty schedule
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning();

    return NextResponse.json(newBarber[0]);

  } catch (error: any) {
    console.error('Error creating barber:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        
        await db.update(barbers).set({
            name: body.name,
            specialty: body.specialty,
            commissionRate: body.commission_rate,
            avatarUrl: body.avatar_url,
            updatedAt: new Date()
        }).where(eq(barbers.id, body.id));

        // Also update the user role if it changed
        const barber = await db.select().from(barbers).where(eq(barbers.id, body.id)).then(res => res[0]);
        if (barber && body.role) {
            await db.update(users).set({ role: body.role, name: body.name, image: body.avatar_url }).where(eq(users.id, barber.userId));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
