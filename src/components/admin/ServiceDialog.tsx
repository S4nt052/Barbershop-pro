'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

import { useRouter } from 'next/navigation'
import { uploadFile } from '@uploadcare/upload-client'
import { Image as ImageIcon, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ServiceDialogProps {
    onSave?: () => void
    barbershopId: string
    initialData?: any
    serviceId?: string
}

export function ServiceDialog({ onSave, barbershopId, initialData, serviceId }: ServiceDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        duration: initialData?.durationMinutes?.toString() || '',
        category: initialData?.category || 'cortes',
        promo_price: initialData?.promoPrice?.toString() || '',
        is_active: initialData?.isActive ?? true
    })
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            let imageUrl = ''

            if (file) {
                const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
                if (publicKey) {
                    const uploadResult = await uploadFile(file, {
                        publicKey,
                        store: 'auto'
                    })
                    imageUrl = uploadResult.cdnUrl ? (uploadResult.cdnUrl.endsWith('/') ? uploadResult.cdnUrl : `${uploadResult.cdnUrl}/`) : `https://ucarecdn.com/${uploadResult.uuid}/`
                }
            }

            await fetch('/api/services', {
                method: serviceId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: serviceId,
                    barbershop_id: barbershopId,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                    promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
                    image_url: imageUrl || previewUrl
                })
            })
            if (onSave) onSave()
            router.refresh()
            setOpen(false)
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                category: 'cortes',
                promo_price: '',
                is_active: true
            })
            setFile(null)
            setPreviewUrl(null)
        } catch (error) {
            console.error('Error creating service:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {serviceId ? (
                    <Button variant="ghost" size="sm">Editar</Button>
                ) : (
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Servicio
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{serviceId ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</DialogTitle>
                    <DialogDescription>
                        {serviceId ? 'Modifica los detalles del servicio.' : 'Agrega un nuevo servicio a tu catálogo.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nombre del Servicio</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Corte Clásico"
                        />
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe el servicio..."
                        />
                    </div>
                    <div>
                        <Label>Categoría</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cortes">Cortes</SelectItem>
                                <SelectItem value="barba">Barba</SelectItem>
                                <SelectItem value="paquetes">Paquetes</SelectItem>
                                <SelectItem value="color">Color</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Precio (€)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="25.00"
                            />
                        </div>
                        <div>
                            <Label>Duración (min)</Label>
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="30"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Precio Promocional (€) - Opcional</Label>
                        <Input
                            type="number"
                            step="0.01"
                            value={formData.promo_price}
                            onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                            placeholder="19.99"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label>Servicio activo</Label>
                    </div>
                    <div>
                        <Label>Imagen del Servicio</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
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
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {serviceId ? 'Guardar Cambios' : 'Crear Servicio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
