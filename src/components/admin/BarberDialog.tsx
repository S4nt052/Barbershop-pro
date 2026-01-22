'use client'

import { useState } from 'react'
import { Plus, User, Mail, Scissors } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadFile } from '@uploadcare/upload-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface BarberDialogProps {
    onSave?: () => void
    barbershopId: string
    initialData?: any
    barberId?: string
}

export function BarberDialog({ onSave, barbershopId, initialData, barberId }: BarberDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        specialty: initialData?.specialty || '',
        commission_rate: initialData?.commissionRate?.toString() || '0.50',
        role: initialData?.role || 'barber'
    })
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.avatarUrl || null)

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
            let avatarUrl = previewUrl // Start with existing previewUrl or null

            if (file) {
                const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
                if (publicKey) {
                    const uploadResult = await uploadFile(file, {
                        publicKey,
                        store: 'auto'
                    })
                    avatarUrl = uploadResult.cdnUrl || `https://ucarecdn.com/${uploadResult.uuid}/`
                }
            }

            await fetch('/api/barbers', {
                method: barberId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    id: barberId,
                    barbershop_id: barbershopId,
                    commission_rate: parseFloat(formData.commission_rate),
                    avatar_url: avatarUrl,
                    role: formData.role
                })
            })
            if (onSave) onSave()
            router.refresh()
            setOpen(false)
            setFormData({
                name: '',
                email: '',
                specialty: '',
                commission_rate: '0.50'
            })
            setFile(null)
            setPreviewUrl(null)
        } catch (error) {
            console.error('Error creating barber:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {barberId ? (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <User className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nuevo Barbero
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{barberId ? 'Editar Barbero' : 'Registrar Nuevo Barbero'}</DialogTitle>
                    <DialogDescription>
                        {barberId ? 'Modifica los datos del barbero.' : 'Se creará una cuenta de usuario para el barbero.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Nombre Completo</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Carlos Santana"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Correo Electrónico</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="barbero@ejemplo.com"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Especialidad</Label>
                        <div className="relative">
                            <Scissors className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                                <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General (Todos los servicios)</SelectItem>
                                    <SelectItem value="barba">Especialista en Barba</SelectItem>
                                    <SelectItem value="color">Colorista</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label>Rol del Usuario</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="barber">Barbero</SelectItem>
                                <SelectItem value="owner">Co-Administrador</SelectItem>
                                <SelectItem value="client">Cliente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Foto de Perfil</Label>
                        <div className="mt-2 flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={previewUrl || ''} />
                                <AvatarFallback className="bg-gray-100"><User className="w-8 h-8 text-gray-400" /></AvatarFallback>
                            </Avatar>
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
                        {barberId ? 'Guardar Cambios' : 'Crear Barbero'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
