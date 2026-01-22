'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Loader2 } from 'lucide-react'

interface BarbershopData {
    id: string
    name: string
    slug: string
    description?: string | null
    address?: string | null
    bannerUrl?: string | null
    settings?: any
}

interface SettingsFormProps {
    barbershop: BarbershopData
}

export function SettingsForm({ barbershop }: SettingsFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: barbershop.name,
        description: barbershop.description || '',
        address: barbershop.address || '',
        phone: barbershop.phone || '',
        bannerUrl: barbershop.bannerUrl || '',
        settings: {
            show_public_site: barbershop.settings?.show_public_site ?? true,
            allow_reviews: barbershop.settings?.allow_reviews ?? true,
            allow_posts: barbershop.settings?.allow_posts ?? true,
            allow_online_booking: barbershop.settings?.allow_online_booking ?? true
        }
    })
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(barbershop.bannerUrl || null)

    const handleSubmit = async () => {
        setLoading(true)
        try {
            let finalBannerUrl = previewUrl

            if (file) {
                const { uploadFile } = await import('@uploadcare/upload-client')
                const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY
                if (publicKey) {
                    const uploadResult = await uploadFile(file, { publicKey, store: 'auto' })
                    finalBannerUrl = uploadResult.cdnUrl ? (uploadResult.cdnUrl.endsWith('/') ? uploadResult.cdnUrl : `${uploadResult.cdnUrl}/`) : `https://ucarecdn.com/${uploadResult.uuid}/`
                }
            }

            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: barbershop.id,
                    ...formData,
                    bannerUrl: finalBannerUrl
                })
            })

            if (!res.ok) throw new Error('Failed to update')

            router.refresh()
            // Optionally show toast
        } catch (error) {
            console.error('Error updating settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const updateSetting = (key: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                [key]: value
            }
        }))
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                    <CardDescription>Detalles visibles en tu página pública.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Nombre de la Barbería</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <Label>Slug (URL)</Label>
                        <Input value={barbershop.slug} disabled className="bg-gray-100" />
                        <p className="text-xs text-muted-foreground mt-1">
                            Tu sitio: /barberia/{barbershop.slug}
                        </p>
                    </div>
                    <div>
                        <Label>Descripción</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Teléfono</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Dirección</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Banner Principal del Sitio Público</Label>
                        <div className="mt-2 space-y-4">
                            <div className="h-40 w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 text-gray-300 mx-auto" />
                                        <p className="text-xs text-gray-400 mt-2">Sin imagen de banner</p>
                                    </div>
                                )}
                            </div>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Funcionalidades (Feature Flags)</CardTitle>
                    <CardDescription>Activa o desactiva módulos según tu plan o preferencia.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Sitio Público</Label>
                            <p className="text-sm text-muted-foreground">Habilitar tu página web pública SEO.</p>
                        </div>
                        <Switch
                            checked={formData.settings.show_public_site}
                            onCheckedChange={(c) => updateSetting('show_public_site', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Reseñas</Label>
                            <p className="text-sm text-muted-foreground">Permitir que los clientes dejen opiniones.</p>
                        </div>
                        <Switch
                            checked={formData.settings.allow_reviews}
                            onCheckedChange={(c) => updateSetting('allow_reviews', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Publicaciones</Label>
                            <p className="text-sm text-muted-foreground">Mostrar galería de cortes y eventos.</p>
                        </div>
                        <Switch
                            checked={formData.settings.allow_posts}
                            onCheckedChange={(c) => updateSetting('allow_posts', c)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Reservas Online</Label>
                            <p className="text-sm text-muted-foreground">Permitir agendar citas desde la web.</p>
                        </div>
                        <Switch
                            checked={formData.settings.allow_online_booking}
                            onCheckedChange={(c) => updateSetting('allow_online_booking', c)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>
        </div>
    )
}
