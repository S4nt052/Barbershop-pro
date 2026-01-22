import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { DrizzleReviewRepository } from '@/modules/reviews/infrastructure/DrizzleReviewRepository';
import { ReviewList } from '@/components/admin/ReviewList';

const barbershopRepo = new DrizzleBarbershopRepository();
const reviewRepo = new DrizzleReviewRepository();

export default async function ReviewsPage() {
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

    // Get Reviews
    const reviews = await reviewRepo.getByBarbershop(barbershop.id);

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Reseñas y Opiniones</h2>
                <p className="text-muted-foreground">Modera los comentarios de tus clientes. Las reseñas aprobadas serán visibles en tu sitio público.</p>
            </div>

            <ReviewList reviews={reviews} />
        </div>
    );
}
