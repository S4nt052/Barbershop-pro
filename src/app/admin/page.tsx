'use client'

import React, { useState, useEffect } from 'react'
import {
    BarChart3,
    Calendar,
    DollarSign,
    Star,
    Users,
    Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // In a real app, this would be a server component fetch or an API call
        // For now, mock data to match the UI flow
        setStats({
            today_appointments: 12,
            pending_appointments: 4,
            week_revenue: 1250,
            average_rating: 4.8,
            total_reviews: 156,
            active_barbers: 5,
            total_barbers: 6,
            recent_appointments: [
                {
                    id: '1',
                    client: { full_name: 'Juan Pérez', avatar_url: '' },
                    service: { name: 'Corte Degradado' },
                    barber: { name: 'Carlos' },
                    appointment_date: '2024-05-20',
                    status: 'confirmed'
                },
                {
                    id: '2',
                    client: { full_name: 'María García', avatar_url: '' },
                    service: { name: 'Perfilado de Barba' },
                    barber: { name: 'Ana' },
                    appointment_date: '2024-05-20',
                    status: 'pending'
                }
            ]
        })
        setLoading(false)
    }, [])

    if (loading) return <div>Cargando dashboard...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Dashboard
                </h2>
                <Link href="/public" target="_blank">
                    <Button variant="outline" className="gap-2">
                        <Globe className="w-4 h-4" />
                        Ver Sitio Público
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.today_appointments}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.pending_appointments} pendientes
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Semana</CardTitle>
                        <DollarSign className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{stats.week_revenue}</div>
                        <p className="text-xs text-muted-foreground">Últimos 7 días</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Calificación</CardTitle>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.average_rating} ⭐</div>
                        <p className="text-xs text-muted-foreground">{stats.total_reviews} reseñas</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Barberos Activos</CardTitle>
                        <Users className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_barbers}</div>
                        <p className="text-xs text-muted-foreground">de {stats.total_barbers} total</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Citas Recientes</CardTitle>
                    <CardDescription>Últimas citas registradas</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recent_appointments.map((apt: any) => (
                            <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={apt.client?.avatar_url} />
                                        <AvatarFallback>{apt.client?.full_name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{apt.client?.full_name}</p>
                                        <p className="text-sm text-gray-500">
                                            {apt.service?.name} - {apt.barber?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{apt.appointment_date}</p>
                                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                                        {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
