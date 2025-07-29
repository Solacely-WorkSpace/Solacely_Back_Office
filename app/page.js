
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/sign-in');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Return a loading state or nothing while checking authentication
  return (
    <main className="flex min-h-screen items-center justify-center">
      {loading && <p>Loading...</p>}
    </main>
  );
}
