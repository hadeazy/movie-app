// components/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/utils/firebase'
import { User } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'

const AuthContext = createContext<{ user: User | null }>({ user: null })

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false)

            if (!user && !pathname.includes('/login') && !pathname.includes('/register')) {
                router.push('/login')
            }
        })

        return () => unsubscribe()
    }, [pathname])

    if (loading) {
        return <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center">
            <div className="text-white">Loading...</div>
        </div>
    }

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}