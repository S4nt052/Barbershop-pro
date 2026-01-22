'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    BarChart3,
    Calendar,
    Scissors,
    Users,
    UserCheck,
    Star,
    Image as ImageIcon,
    Settings,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Agenda', href: '/admin/appointments', icon: Calendar },
    { name: 'Servicios', href: '/admin/services', icon: Scissors },
    { name: 'Barberos', href: '/admin/barbers', icon: Users },
    { name: 'Clientes', href: '/admin/clients', icon: UserCheck },
    { name: 'Reseñas', href: '/admin/reviews', icon: Star },
    { name: 'Publicaciones', href: '/admin/posts', icon: ImageIcon },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    BarberShop SaaS
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-600"
                            )} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group">
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    )
}
