import { NextResponse } from 'next/server';
import { db } from '@/modules/shared/infrastructure/database/db';
import { appointments, users, services, barbers } from '@/modules/shared/infrastructure/database/schema';
import { auth } from '@/modules/users/infrastructure/auth';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, sql } from 'drizzle-orm';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';

const barbershopRepo = new DrizzleBarbershopRepository();

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const status = searchParams.get('status');

        const barbershop = await barbershopRepo.getByOwnerId(session.user.id);
        if (!barbershop) return NextResponse.json({ error: 'No barbershop found' }, { status: 404 });

        let query = db.select({
            id: appointments.id,
            startTime: appointments.startTime,
            endTime: appointments.endTime,
            status: appointments.status,
            client: {
                name: users.name,
                image: users.image
            },
            service: {
                name: services.name,
                price: services.price,
                duration: services.durationMinutes
            },
            barber: {
                name: barbers.name
            }
        })
        .from(appointments)
        .leftJoin(users, eq(appointments.clientId, users.id))
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .leftJoin(barbers, eq(appointments.barberId, barbers.id))
        .where(eq(appointments.barbershopId, barbershop.id));

        // Add additional filters if needed (e.g. by date we might need to cast to day)
        // For simplicity in MVP, return all for the shop and let client filter if small enough
        // but real app should filter by date in SQL.
        
        const results = await query;
        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const startTime = new Date(body.startTime);
        const duration = body.durationMinutes || 30;
        const endTime = new Date(startTime.getTime() + duration * 60000);

        // 1. Check for Over-scheduling (CRITICAL SPEC REQUIREMENT)
        const overlaps = await db.select()
            .from(appointments)
            .where(
                and(
                    eq(appointments.barberId, body.barberId),
                    sql`${appointments.startTime} < ${endTime.toISOString()}`,
                    sql`${appointments.endTime} > ${startTime.toISOString()}`,
                    sql`${appointments.status} != 'cancelled'`
                )
            );

        if (overlaps.length > 0) {
            return NextResponse.json({ 
                error: 'Este horario ya no está disponible. Puedes consultarnos por WhatsApp al +505 88888888 por cancelaciones.' 
            }, { status: 400 });
        }
        
        const id = uuidv4();
        await db.insert(appointments).values({
            id,
            barbershopId: body.barbershopId,
            branchId: body.branchId || 'default', // Fallback to avoid null in notNull field if exists
            clientId: body.clientId,
            serviceId: body.serviceId,
            barberId: body.barberId,
            startTime,
            endTime,
            status: 'scheduled',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ id });
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
