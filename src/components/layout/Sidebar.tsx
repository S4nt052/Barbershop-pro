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
    LogOut,
    UserCircle,
    Building
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
    const router = useRouter()
    const { data: session, isPending } = authClient.useSession()
    const [shopInfo, setShopInfo] = React.useState<{ name: string } | null>(null)

    React.useEffect(() => {
        if (session?.user?.role === 'owner' || session?.user?.role === 'super_admin') {
            fetch('/api/settings')
                .then(res => res.json())
                .then(data => {
                    if (data && data.name) {
                        setShopInfo({ name: data.name })
                    }
                })
                .catch(err => console.error('Error fetching shop name for sidebar:', err))
        }
    }, [session])

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/login')
                    router.refresh()
                }
            }
        })
    }

    const user = session?.user

    return (
        <div className="flex flex-col h-full bg-white border-r">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 truncate">
                    <Building className="w-6 h-6 text-indigo-600 shrink-0" />
                    <span className="truncate">{shopInfo?.name || 'Mi Negocio'}</span>
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

            <div className="p-4 border-t space-y-4">
                {user && (
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <Avatar className="h-9 w-9 border-2 border-indigo-100">
                            <AvatarImage src={user.image || ''} />
                            <AvatarFallback className="bg-indigo-50 text-indigo-700">
                                {user.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-indigo-600 font-bold uppercase tracking-tighter">{user.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all group"
                >
                    <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
                <div className="pt-4 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">Powered by BarberShop SaaS</p>
                </div>
            </div>
        </div>
    )
}
