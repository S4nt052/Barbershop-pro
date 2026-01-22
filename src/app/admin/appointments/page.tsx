'use client'

import React, { useState } from 'react'
import { Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
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
    const [appointments, setAppointments] = useState<any[]>([]) // Mocked for now

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Agenda de Citas</h2>
                <AppointmentDialog
                    onSave={(data) => console.log('Saving appointment', data)}
                    services={[]}
                    barbers={[]}
                    users={[]}
                />
            </div>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Label>Estado</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="pending">Pendientes</SelectItem>
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
                {appointments.length > 0 ? (
                    appointments.map((apt) => (
                        <Card key={apt.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex flex-col items-center justify-center bg-indigo-100 rounded-lg p-3 min-w-[80px]">
                                            <span className="text-2xl font-bold text-indigo-600">{apt.appointment_time}</span>
                                            <span className="text-xs text-gray-600">{apt.appointment_date}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={apt.client?.avatar_url} />
                                                    <AvatarFallback>{apt.client?.full_name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold">{apt.client?.full_name}</p>
                                                    <p className="text-sm text-gray-600">{apt.service?.name}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {apt.barber?.name}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {apt.service?.duration} min
                                                </span>
                                                <span className="font-semibold text-indigo-600">
                                                    €{apt.service?.promo_price || apt.service?.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant="outline">{apt.status}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-center text-gray-500 py-8">No hay citas para los filtros seleccionados</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
