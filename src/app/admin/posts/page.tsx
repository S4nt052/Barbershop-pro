import { auth } from '@/modules/users/infrastructure/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository';
import { DrizzlePostRepository } from '@/modules/posts/infrastructure/DrizzlePostRepository';
import { PostDialog } from '@/components/admin/PostDialog';
import { PostCard } from '@/components/admin/PostCard';
import { Card } from '@/components/ui/card';

const barbershopRepo = new DrizzleBarbershopRepository();
const postRepo = new DrizzlePostRepository();

export default async function PostsPage() {
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

    // Get Posts
    const posts = await postRepo.getByBarbershop(barbershop.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Galería y Publicaciones</h2>
                    <p className="text-muted-foreground">Comparte tus mejores trabajos y promociones en tu sitio.</p>
                </div>
                <PostDialog barbershopId={barbershop.id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.length === 0 ? (
                    <Card className="col-span-full border-dashed p-8 text-center bg-gray-50/50">
                        <div className="text-muted-foreground">No hay publicaciones. ¡Sube tu primera foto!</div>
                    </Card>
                ) : posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}
