'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, Check, X, Loader2 } from 'lucide-react'
import { Review } from '@/modules/reviews/domain/ReviewRepository'

interface ReviewListProps {
    reviews: Review[]
}

export function ReviewList({ reviews }: ReviewListProps) {
    const router = useRouter()
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

    const handleModerate = async (id: string, isApproved: boolean) => {
        setLoadingMap(prev => ({ ...prev, [id]: true }))
        try {
            await fetch('/api/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId: id, isApproved })
            })
            router.refresh()
        } catch (error) {
            console.error('Error moderating review:', error)
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: false }))
        }
    }

    if (reviews.length === 0) {
        return (
            <Card className="border-dashed p-8 text-center bg-gray-50/50">
                <div className="text-muted-foreground">No tienes reseñas registradas aún.</div>
            </Card>
        )
    }

    return (
        <div className="grid gap-4">
            {reviews.map((review) => (
                <Card key={review.id} className={review.isApproved ? 'border-green-100' : 'border-yellow-100 bg-yellow-50/30'}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.user?.image || ''} />
                                    <AvatarFallback>{review.user?.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-semibold">{review.user?.name || 'Usuario Anónimo'}</CardTitle>
                                    <CardDescription className="text-xs">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant={review.isApproved ? 'secondary' : 'outline'} className={review.isApproved ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200'}>
                                {review.isApproved ? 'Publicada' : 'Pendiente'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="flex items-center gap-1 mb-2 text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <p className="text-sm text-gray-700">{review.comment || 'Sin comentario.'}</p>
                        {review.imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden border max-w-sm">
                                <img src={review.imageUrl} alt="Review attachment" className="w-full h-auto object-cover max-h-60" />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-2">
                        {!review.isApproved && (
                            <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-8"
                                onClick={() => handleModerate(review.id, true)}
                                disabled={loadingMap[review.id]}
                            >
                                {loadingMap[review.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Aprobar</>}
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                            onClick={() => handleModerate(review.id, false)} // Rejecting basically hides it / sets to pending
                            disabled={loadingMap[review.id]}
                        >
                            {loadingMap[review.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <><X className="w-4 h-4 mr-1" /> Ocultar</>}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
