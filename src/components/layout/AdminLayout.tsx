import React from 'react'
import { Sidebar } from './Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <div className="w-64">
                    <Sidebar />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="bg-white border-b lg:hidden px-4 py-3 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        BarberShop SaaS
                    </h1>
                    {/* Mobile Menu Button would go here */}
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
