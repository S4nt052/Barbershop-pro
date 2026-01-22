'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Users, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppointmentDialog } from '@/components/admin/AppointmentDialog'

export default function AppointmentsPage() {
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0])
    const [statusFilter, setStatusFilter] = useState('all')
    const [appointments, setAppointments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAppointments = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/appointments?date=${dateFilter}&status=${statusFilter}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                setAppointments(data)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [dateFilter, statusFilter])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Agenda de Citas</h2>
                    <p className="text-muted-foreground text-sm">Gestiona el flujo de clientes y horarios.</p>
                </div>
                <AppointmentDialog
                    onSave={fetchAppointments}
                    services={[]}
                    barbers={[]}
                    users={[]}
                />
            </div>

            <Card className="border-none shadow-sm bg-indigo-50/30">
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-6 items-end">
                        <div className="w-full sm:w-64">
                            <Label className="text-xs font-bold text-indigo-900 uppercase">Filtrar por Fecha</Label>
                            <Input
                                type="date"
                                className="mt-1 bg-white"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <div className="w-full sm:w-64">
                            <Label className="text-xs font-bold text-indigo-900 uppercase">Estado</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="mt-1 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="scheduled">Programadas</SelectItem>
                                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                                    <SelectItem value="completed">Completadas</SelectItem>
                                    <SelectItem value="cancelled">Canceladas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Cargando agenda...</p>
                    </div>
                ) : appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <Card key={apt.id} className="hover:shadow-md transition-all border-none shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="flex flex-col items-center justify-center bg-indigo-600 rounded-2xl p-4 min-w-[100px] text-white shadow-lg shadow-indigo-200">
                                            <span className="text-2xl font-bold">
                                                {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="text-[10px] uppercase font-bold opacity-80">
                                                {new Date(apt.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                    <AvatarImage src={apt.client?.image || ''} />
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                                        {apt.client?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-lg leading-tight">{apt.client?.name || 'Cliente sin nombre'}</p>
                                                    <p className="text-sm text-indigo-600 font-medium">{apt.service?.name}</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                                                <span className="flex items-center gap-2 text-gray-600">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    Barbero: <span className="font-semibold text-gray-900">{apt.barber?.name || 'Cualquiera'}</span>
                                                </span>
                                                <span className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="w-4 h-4 text-gray-400" />
                                                    {apt.service?.duration || 30} min
                                                </span>
                                                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">
                                                    €{apt.service?.price || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={`
                                            px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    apt.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-red-100 text-red-700'}
                                        `}>
                                            {apt.status === 'scheduled' ? 'Programada' :
                                                apt.status === 'confirmed' ? 'Confirmada' :
                                                    apt.status === 'completed' ? 'Finalizada' : 'Cancelada'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-dashed border-2 py-20 text-center">
                        <CardContent>
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay citas registradas para este día.</p>
                            <Button variant="link" className="text-indigo-600 mt-2" onClick={() => setDateFilter(new Date().toISOString().split('T')[0])}>
                                Volver a hoy
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
