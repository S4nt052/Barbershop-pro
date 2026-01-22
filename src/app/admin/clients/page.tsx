import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Calendar } from 'lucide-react';
import { db } from '@/modules/shared/infrastructure/database/db';
import { appointments, users } from '@/modules/shared/infrastructure/database/schema';
import { eq, sql, max, count } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const barbershopRepo = new DrizzleBarbershopRepository();

export default async function ClientsPage() {
    const session = await auth.api.getSession({
        headers: headers()
    });

    if (!session) {
        redirect('/auth/login');
    }

    const barbershop = await barbershopRepo.getByOwnerId(session.user.id);

    if (!barbershop) {
        return (
            <div className="p-8 text-center text-gray-500">
                No tienes una barbería asignada.
            </div>
        );
    }

    // Fetch clients who have appointments in this barbershop
    const clientsList = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        lastAppointment: max(appointments.startTime),
        totalAppointments: count(appointments.id)
    })
        .from(appointments)
        .innerJoin(users, eq(appointments.clientId, users.id))
        .where(eq(appointments.barbershopId, barbershop.id))
        .groupBy(users.id, users.name, users.email, users.image);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
                <p className="text-muted-foreground">Listado de clientes que han visitado tu barbería.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientsList.length === 0 ? (
                    <Card className="col-span-full border-dashed p-8 text-center bg-gray-50/50">
                        <div className="text-muted-foreground">Aún no tienes clientes registrados a través de citas.</div>
                    </Card>
                ) : clientsList.map((client: any) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={client.image || ''} />
                                <AvatarFallback>{client.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3 h-3" /> {client.email}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mt-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Total servicios</span>
                                    <span className="font-medium">{client.totalAppointments}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Última visita</span>
                                    <span className="font-medium flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {client.lastAppointment ? new Date(client.lastAppointment).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
