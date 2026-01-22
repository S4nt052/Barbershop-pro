import React from 'react'
import { notFound } from 'next/navigation'
import {
    Star,
    Users,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Home
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { DrizzleBarbershopRepository } from '@/modules/barbershops/infrastructure/DrizzleBarbershopRepository'

interface PublicPageProps {
    params: {
        slug: string
    }
}

export default async function PublicBarberShopPage({ params }: PublicPageProps) {
    const repo = new DrizzleBarbershopRepository()
    const shop = await repo.getBySlug(params.slug)

    if (!shop) {
        notFound()
    }

    // Check if public site feature is active
    if (!shop.settings.showPublicSite) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Sitio en construcción</h1>
                    <p className="text-gray-600">Esta barbería no tiene habilitado su sitio público.</p>
                    <Link href="/">
                        <Button className="mt-4">Volver al inicio</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gradient-to-r from-gray-900 to-indigo-900 overflow-hidden">
                <div className="absolute inset-0 bg-black/40" />
                {shop.bannerUrl && (
                    <img src={shop.bannerUrl} alt={shop.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                )}
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                            {shop.name}
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl">
                            {shop.description || 'Profesionales del corte y estilo preparados para darte el mejor servicio.'}
                        </p>
                        <div className="flex flex-wrap gap-6 text-white/90">
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">4.8 estrellas</span>
                            </div>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                                <Users className="w-5 h-5" />
                                <span>Equipo profesional</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 -mt-16 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Services */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                Nuestros Servicios
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Mocked services for now - should fetch from DB */}
                                {[1, 2, 3, 4].map((i) => (
                                    <Card key={i} className="hover:shadow-md transition-all">
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold">Corte Clásico {i}</h3>
                                                <span className="text-xl font-bold text-indigo-600">€25</span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-4">Servicio profesional de corte con lavado y peinado incluido.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> 30 min
                                                </span>
                                                <Button size="sm">Reservar</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Info & Booking Sidebar */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Horarios y Ubicación</CardTitle>
                                <CardDescription>Visítanos en nuestro local</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                                        <span className="text-gray-700">{shop.address || 'Dirección no disponible'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-indigo-600" />
                                        <span className="text-gray-700">{shop.phone || 'Teléfono no disponible'}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-indigo-600" />
                                        <span className="text-gray-700">{shop.email || 'Email no disponible'}</span>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="font-bold mb-4">Horas de atención</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Lunes - Viernes</span>
                                            <span className="font-medium text-gray-900">09:00 - 20:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Sábado</span>
                                            <span className="font-medium text-gray-900">10:00 - 18:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Domingo</span>
                                            <span className="font-bold text-red-500">Cerrado</span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 py-6 text-lg">
                                    Agendar Cita Ahora
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}
