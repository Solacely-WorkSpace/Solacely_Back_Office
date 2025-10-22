"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.push(isAuthenticated ? '/dashboard' : '/sign-in');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">Loading...</div>
    </main>
  );
}
