'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scissors, Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authClient } from '@/lib/auth-client'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error: authError } = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: '/admin'
            })

            if (authError) {
                setError(authError.message || 'Credenciales incorrectas')
                setLoading(false)
                return
            }

            console.log('Logged in:', data)
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

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="shadow-xl border-t-4 border-t-indigo-600">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
                        <CardDescription>
                            Ingresa tus credenciales para acceder a tu panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
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
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Iniciar Sesión"}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 text-center">
                        <div className="text-sm text-gray-500">
                            ¿No tienes una cuenta?{' '}
                            <Link href="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 mt-1 transition-colors">
                                Registra tu barbería hoy <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
