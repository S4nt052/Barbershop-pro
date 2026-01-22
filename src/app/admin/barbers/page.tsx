import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { DrizzleBarberRepository } from '@/modules/barbershops/infrastructure/DrizzleBarberRepository';
import { BarberDialog } from '@/components/admin/BarberDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scissors, Percent } from 'lucide-react';

const barbershopRepo = new DrizzleBarbershopRepository();
const barberRepo = new DrizzleBarberRepository();

export default async function BarbersPage() {
    const session = await auth.api.getSession({
        headers: headers()
    });

    if (!session) {
        redirect('/auth/login');
    }

    // Get Barbershop
    const barbershop = await barbershopRepo.getByOwnerId(session.user.id);

    if (!barbershop) {
        return (
            <div className="p-8 text-center text-gray-500">
                No tienes una barbería asignada. Contacta soporte.
            </div>
        );
    }

    // Get Barbers
    const barbers = await barberRepo.getByBarbershop(barbershop.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Barberos</h2>
                    <p className="text-muted-foreground">Gestiona tu equipo de trabajo y sus comisiones.</p>
                </div>
                <BarberDialog barbershopId={barbershop.id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {barbers.length === 0 ? (
                    <Card className="col-span-full border-dashed p-8 text-center bg-gray-50/50">
                        <div className="text-muted-foreground">No tienes barberos registrados. Invita al primero.</div>
                    </Card>
                ) : barbers.map((barber) => (
                    <Card key={barber.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={barber.avatarUrl || ''} />
                                <AvatarFallback>{barber.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-bold">{barber.name}</CardTitle>
                                    <Badge variant={barber.isActive ? 'default' : 'secondary'} className="mt-1">
                                        {barber.isActive ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </div>
                                <BarberDialog barbershopId={barbershop.id} barberId={barber.id} initialData={barber} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mt-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Scissors className="w-4 h-4" /> Especialidad
                                    </span>
                                    <span className="font-medium capitalize">{barber.specialty || 'General'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Percent className="w-4 h-4" /> Comisión
                                    </span>
                                    <span className="font-medium">{(barber.commissionRate * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
