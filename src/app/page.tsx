import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Scissors, Calendar, BarChart3, Star, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BarberShop SaaS
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700">Registrar Mi Barbería</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Gestiona tu barbería como un <span className="text-indigo-600">profesional</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              La plataforma integral para barberos modernos. Agenda inteligente, gestión de sucursales,
              marketing automático y fidelización de clientes en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 h-auto">
                Empezar Prueba Gratuita
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
                Ver Demo Pública
              </Button>
            </div>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que necesitas para crecer</h2>
            <p className="text-gray-600">Diseñado por barberos para barberos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-indigo-600" />}
              title="Agenda Inteligente"
              description="Evita sobreagendas. Validación de disponibilidad en tiempo real por barbero y servicio."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Analítica Avanzada"
              description="Visualiza tus ingresos, rendimiento de barberos y retención de clientes fácilmente."
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-indigo-600" />}
              title="Sitio Público SEO"
              description="Obtén una página web profesional para tu barbería indexable en Google."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-10">Confiado por más de 500 barberías en Latinoamérica</h3>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
            {/* Logo placeholders */}
            <span className="text-2xl font-black italic">BARBER PRO</span>
            <span className="text-2xl font-black italic">KING CORTES</span>
            <span className="text-2xl font-black italic">LEGACY CLUB</span>
            <span className="text-2xl font-black italic">THE BUNKER</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold">BarberShop SaaS</span>
          </div>
          <div className="flex gap-8 text-gray-400">
            <Link href="#" className="hover:text-white">Términos</Link>
            <Link href="#" className="hover:text-white">Privacidad</Link>
            <Link href="#" className="hover:text-white">Contacto</Link>
          </div>
          <p className="text-gray-500">© 2024 BarberShop SaaS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center gap-2 text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 text-green-500" /> Incluido en el plan base
        </li>
      </ul>
    </div>
  )
}
