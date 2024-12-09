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

            // If user is logged in and on login/register page, redirect to home
            if (user && (pathname === '/login' || pathname === '/register')) {
                router.push('/')
            }
            // If no user and not on auth pages, redirect to login
            else if (!user && !pathname.includes('/login') && !pathname.includes('/register')) {
                router.push('/login')
            }
        })

        return () => unsubscribe()
    }, [pathname])

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}