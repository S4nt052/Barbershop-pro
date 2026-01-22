import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { SettingsForm } from '@/components/admin/SettingsForm';

const barbershopRepo = new DrizzleBarbershopRepository();

export default async function SettingsPage() {
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

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">Administra la información de tu negocio y las funcionalidades activas.</p>
            </div>

            <SettingsForm barbershop={barbershop} />
        </div>
    );
}
