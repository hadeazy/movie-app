// @ts-nocheck
'use client'

import { useState, useEffect } from 'react';
import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const returnUrl = searchParams.get('from') || '/';
      router.push(returnUrl);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const returnUrl = searchParams.get('from') || '/';
        router.push(returnUrl);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0C0F] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#1A1C22] p-6 rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded text-white"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-[#0B0C0F] border border-gray-700 rounded text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1CE783] text-black font-medium p-3 rounded hover:bg-[#15B76C]"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#1CE783] hover:text-[#15B76C]">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}