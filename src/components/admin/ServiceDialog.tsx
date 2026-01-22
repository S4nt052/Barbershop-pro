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

interface ServiceDialogProps {
    onSave: () => void
    barbershopId: string
}

export function ServiceDialog({ onSave, barbershopId }: ServiceDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: 'cortes',
        promo_price: '',
        is_active: true
    })

    const handleSubmit = async () => {
        try {
            await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    barbershop_id: barbershopId,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                    promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null
                })
            })
            onSave()
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
        } catch (error) {
            console.error('Error creating service:', error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Servicio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                    <DialogDescription>Agrega un nuevo servicio a tu catálogo</DialogDescription>
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Crear Servicio</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
