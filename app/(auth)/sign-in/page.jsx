"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="min-h-screen bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Side - Image */}
        <section className="relative flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 lg:col-span-7 lg:h-full xl:col-span-7">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300 rounded-full opacity-10"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-8">
            <Image
              src="/Left-paw.png"
              alt="Solacely Logo"
              width={200}
              height={200}
              className="mx-auto mb-8 drop-shadow-2xl"
            />
            <h1 className="text-4xl font-bold mb-4">Welcome Back to Solacely</h1>
            <p className="text-xl opacity-90">Your trusted platform for finding the perfect home</p>
          </div>
        </section>

        {/* Right Side - Sign In Form */}
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-5 lg:px-16 lg:py-12 xl:col-span-5">
          <div className="max-w-xl lg:max-w-3xl w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/sign-up" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}