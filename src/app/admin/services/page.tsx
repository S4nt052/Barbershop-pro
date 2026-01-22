import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { DrizzleServiceRepository } from '@/modules/appointments/infrastructure/DrizzleServiceRepository';
import { ServiceDialog } from '@/components/admin/ServiceDialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Tag } from 'lucide-react';

const barbershopRepo = new DrizzleBarbershopRepository();
const serviceRepo = new DrizzleServiceRepository();

export default async function ServicesPage() {
    const session = await auth.api.getSession({
        headers: headers()
    });

    if (!session) {
        return (
            <div className="p-8 border-2 border-red-500 bg-red-50 text-red-700">
                <h2 className="text-xl font-bold">Debug: Sesión no encontrada</h2>
                <p>El servidor no detectó una sesión activa en este Componente de Servidor.</p>
                <p className="text-sm mt-2">Cookies presentes: {headers().get('cookie') ? 'SÍ' : 'NO'}</p>
                <a href="/auth/login" className="underline mt-4 block">Ir al Login</a>
            </div>
        )
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

    // Get Services
    const services = await serviceRepo.getByBarbershop(barbershop.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Servicios</h2>
                    <p className="text-muted-foreground">Administra el catálogo de servicios de tu barbería.</p>
                </div>
                <ServiceDialog barbershopId={barbershop.id} onSave={async () => { 'use server'; /* Nextjs handles revalidation automatically usually, but here we might need a client manual refresh or router.refresh() passed to dialog */ }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.length === 0 ? (
                    <Card className="col-span-full border-dashed p-8 text-center bg-gray-50/50">
                        <div className="text-muted-foreground">No tienes servicios configurados aún. ¡Crea el primero!</div>
                    </Card>
                ) : services.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                        {service.imageUrl && (
                            <div className="h-40 w-full overflow-hidden">
                                <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg font-bold">{service.name}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-1">{service.description || 'Sin descripción'}</CardDescription>
                                </div>
                                <ServiceDialog barbershopId={barbershop.id} serviceId={service.id} initialData={service} />
                            </div>
                            <Badge variant={service.isActive ? 'default' : 'secondary'}>
                                {service.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {service.durationMinutes} min
                                </div>
                                <div className="flex items-center gap-1 uppercase text-xs font-semibold tracking-wide">
                                    <Tag className="w-4 h-4" />
                                    {service.category}
                                </div>
                            </div>
                            <div className="mt-4 text-xl font-bold text-indigo-600">
                                {service.promoPrice ? (
                                    <div className="flex items-end gap-2">
                                        <span>€{service.promoPrice}</span>
                                        <span className="text-sm text-gray-400 line-through font-normal">€{service.price}</span>
                                    </div>
                                ) : (
                                    <span>€{service.price}</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
