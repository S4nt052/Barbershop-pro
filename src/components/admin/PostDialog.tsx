'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadFile } from '@uploadcare/upload-client'

interface PostDialogProps {
    onSave?: () => void
    barbershopId: string
    initialData?: any
    postId?: string
}

export function PostDialog({ onSave, barbershopId, initialData, postId }: PostDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        post_type: initialData?.postType || 'corte'
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async () => {
        if (!file) return; // Validate required

        setLoading(true)
        try {
            // 1. Upload Image to Uploadcare
            const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
            if (!publicKey) throw new Error('Missing Uploadcare Public Key')

            const uploadResult = await uploadFile(file, {
                publicKey: publicKey,
                store: 'auto',
                fileName: file.name
            })

            const imageUrl = uploadResult.cdnUrl ? (uploadResult.cdnUrl.endsWith('/') ? uploadResult.cdnUrl : `${uploadResult.cdnUrl}/`) : `https://ucarecdn.com/${uploadResult.uuid}/`

            // 2. Save/Update Post
            await fetch('/api/posts', {
                method: postId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: postId,
                    barbershop_id: barbershopId,
                    image_url: imageUrl || previewUrl
                })
            })

            if (onSave) onSave()
            router.refresh()
            setOpen(false)
            setFile(null)
            setFormData({ title: '', description: '', post_type: 'corte' })

        } catch (error) {
            console.error('Error creating post:', error)
            alert('Error creating post. Please check console.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {postId ? (
                    <Button variant="ghost" size="sm" className="absolute top-2 right-12 bg-white/50 backdrop-blur hover:bg-white text-gray-800 rounded-full h-8 w-8 p-0">
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Post
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Publicar Nuevo Contenido</DialogTitle>
                    <DialogDescription>
                        Sube fotos de tus mejores cortes o promociones.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Título</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Fade Increíble"
                        />
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles sobre el corte o evento..."
                        />
                    </div>
                    <div>
                        <Label>Tipo de Publicación</Label>
                        <Select value={formData.post_type} onValueChange={(value) => setFormData({ ...formData, post_type: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="corte">Corte / Trabajo</SelectItem>
                                <SelectItem value="promo">Promoción</SelectItem>
                                <SelectItem value="evento">Evento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Imagen</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={loading || (!file && !postId)}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                        {loading ? 'Guardando...' : postId ? 'Guardar Cambios' : 'Publicar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
