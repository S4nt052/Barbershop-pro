'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AppointmentDialogProps {
    onSave: (data: any) => void
    services: any[]
    barbers: any[]
    users: any[]
}

export function AppointmentDialog({ onSave, services, barbers, users }: AppointmentDialogProps) {
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        client_id: '',
        barber_id: '',
        service_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        notes: ''
    })

    const clients = users.filter((u: any) => u.role === 'client')

    const handleSubmit = () => {
        onSave(formData)
        setOpen(false)
        setFormData({
            client_id: '',
            barber_id: '',
            service_id: '',
            appointment_date: new Date().toISOString().split('T')[0],
            appointment_time: '10:00',
            notes: ''
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nueva Cita
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Cita</DialogTitle>
                    <DialogDescription>Agenda una nueva cita para un cliente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Cliente</Label>
                        <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {clients.map((client: any) => (
                                    <SelectItem key={client.id} value={client.id}>{client.full_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Servicio</Label>
                        <Select value={formData.service_id} onValueChange={(value) => setFormData({ ...formData, service_id: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service: any) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name} - €{service.promo_price || service.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Barbero</Label>
                        <Select value={formData.barber_id} onValueChange={(value) => setFormData({ ...formData, barber_id: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un barbero" />
                            </SelectTrigger>
                            <SelectContent>
                                {barbers.map((barber: any) => (
                                    <SelectItem key={barber.id} value={barber.id}>{barber.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={formData.appointment_date}
                                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Hora</Label>
                            <Input
                                type="time"
                                value={formData.appointment_time}
                                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Notas</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Notas adicionales..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Crear Cita</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
