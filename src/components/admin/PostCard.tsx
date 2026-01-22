'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Loader2, Edit2 } from 'lucide-react'
import { Post } from '@/modules/posts/domain/PostRepository'
import { PostDialog } from './PostDialog'

interface PostCardProps {
    post: Post
}

export function PostCard({ post }: PostCardProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setLoading(true)
        try {
            await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE'
            })
            router.refresh()
        } catch (error) {
            console.error('Error deleting post:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-video w-full relative bg-gray-200 group">
                {/* Standard img tag used intentionally for MVP */}
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="object-cover w-full h-full"
                />
                <Badge className="absolute top-2 left-2 bg-white/90 text-black hover:bg-white shadow-sm">
                    {post.postType}
                </Badge>
                <PostDialog barbershopId={post.barbershopId} postId={post.id} initialData={post} />
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                <CardDescription className="text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">{post.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Eliminar
                </Button>
            </CardFooter>
        </Card>
    )
}
