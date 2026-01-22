import React from 'react'
import Link from 'next/link'
import { Scissors, MapPin, Star, ExternalLink, Clock, ShieldCheck } from 'lucide-react'
import { db } from '@/modules/shared/infrastructure/database/db'
import { barbershops } from '@/modules/shared/infrastructure/database/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function PublicShowcasePage() {
    const shops = await db.select().from(barbershops)

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden min-h-[60vh] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-30 scale-110 blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/95 to-[#0f172a]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
                    <div className="text-center max-w-3xl mx-auto">
                        <Badge className="mb-4 bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1">
                            Directorio Exclusivo de Barberías
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                            Encuentra tu Estilo Perfecto
                        </h1>
                        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                            Explora las mejores barberías de la ciudad. Calidad certificada, barberos expertos y el mejor ambiente para tu cuidado personal.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Scissors className="w-8 h-8 text-indigo-500" />
                            Barberías Destacadas
                        </h2>
                        <p className="text-gray-500 mt-2 text-lg">Los establecimientos más solicitados de este mes.</p>
                    </div>
                </div>

                {shops.length === 0 ? (
                    <div className="text-center bg-[#1e293b] p-24 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <Scissors className="w-16 h-16 text-indigo-500/30 mx-auto mb-6" />
                        <p className="text-2xl text-gray-400 font-medium">Pronto verás aquí a las mejores barberías.</p>
                        <Link href="/auth/register" className="mt-8 inline-block">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-6 h-auto rounded-xl shadow-lg shadow-indigo-500/20">
                                Registra tu local ahora
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {shops.map((shop) => (
                            <Card key={shop.id} className="group overflow-hidden bg-[#1e293b] border-white/5 shadow-2xl rounded-[2rem] transition-all hover:-translate-y-2">
                                <Link href={`/barberia/${shop.slug}`} className="block">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent z-10"></div>
                                        <div className="absolute top-4 left-4 z-20 flex gap-2">
                                            <Badge className="bg-white/10 backdrop-blur-md border-white/10 text-white">
                                                Abierto ahora
                                            </Badge>
                                        </div>
                                        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                            <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                                        </div>
                                        {/* Placeholder image that looks premium */}
                                        <div className="h-full w-full bg-[#0f172a] flex items-center justify-center p-12 group-hover:scale-110 transition-transform duration-500">
                                            <h3 className="text-4xl font-black text-white/10 uppercase italic tracking-tighter">
                                                {shop.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <CardContent className="pt-0 pb-8 px-8 relative z-20">
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{shop.name}</h3>
                                        <div className="flex flex-col gap-3 text-gray-400 text-sm mb-8">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-indigo-500" />
                                                <span>Distrito Central, Ciudad de Barberos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-indigo-500" />
                                                <span>Lunes - Sábado: 09:00 - 20:00</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                                <span className="text-xs uppercase font-bold tracking-widest text-green-500/80">Verificado</span>
                                            </div>
                                            <Button size="sm" className="rounded-full bg-white text-[#0f172a] hover:bg-gray-200 font-bold px-6">
                                                Visitar <ExternalLink className="w-3.5 h-3.5 ml-2" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-32 rounded-[3rem] bg-indigo-600 relative overflow-hidden p-12 md:p-24 text-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">¿Eres dueño de una Barbería?</h2>
                        <p className="text-xl text-indigo-100 mb-10 leading-relaxed opacity-80">
                            Digitaliza tu negocio en minutos. Únete a la red de barberos más exclusiva de la región.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-indigo-50 text-xl px-10 py-8 h-auto rounded-[1.5rem] font-black shadow-2xl">
                                EMPEZAR AHORA GRATIS
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
