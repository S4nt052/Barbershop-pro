'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scissors, Mail, Lock, Loader2, User, Building, Phone, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authClient } from '@/lib/auth-client'

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        shopName: '',
        email: '',
        phone: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                callbackURL: '/admin'
            })

            if (authError) {
                setError(authError.message || 'Error al crear la cuenta')
                setLoading(false)
                return
            }

            // Create the Barbershop record for the owner
            const slug = formData.shopName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

            const shopResponse = await fetch('/api/barbershops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.shopName,
                    slug: slug
                })
            })

            if (!shopResponse.ok) {
                const errorData = await shopResponse.json()
                setError(errorData.error || 'Usuario creado pero falló la creación de la barbería')
                setLoading(false)
                return
            }

            console.log('User and Barbershop created successfully')
            router.push('/admin')

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <Scissors className="w-10 h-10 text-indigo-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        BarberShop SaaS
                    </span>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <Card className="shadow-xl border-t-4 border-t-indigo-600">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Crea tu cuenta</CardTitle>
                        <CardDescription>
                            Comienza a gestionar tu barbería de manera profesional
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            placeholder="Juan Pérez"
                                            className="pl-10"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shop_name">Nombre de la Barbería</Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="shop_name"
                                            placeholder="Legendary Cuts"
                                            className="pl-10"
                                            required
                                            value={formData.shopName}
                                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nombre@barberia.com"
                                        className="pl-10"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono de Contacto</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+54 11 1234-5678"
                                        className="pl-10"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-10"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-4" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Registrar Mi Barbería"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center">
                        <div className="text-sm text-gray-500">
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                Inicia Sesión
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
