import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BarberShop Manager - Sistema de Gestión para Barberías',
  description: 'Plataforma completa para gestionar tu barbería: citas, clientes, servicios y presencia digital',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  )
}