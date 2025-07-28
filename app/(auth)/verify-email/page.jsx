"use client";
import React, { useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/utils/api/auth';
import { useRouter, useSearchParams } from 'next/navigation'; // Add useSearchParams here
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Create a separate component that uses useSearchParams
function EmailVerifier() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { verifyEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await verifyEmail({ email, otp });
      router.push('/sign-in');
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email not found');
      return;
    }
    
    setResending(true);
    try {
      await authAPI.resendOTP(email);
      toast.success('OTP sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
          <p className="mt-2 text-gray-600">
            We've sent a verification code to {email || 'your email'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <><Loader2 className="animate-spin h-4 w-4 mr-2" />Verifying...</>
            ) : (
              'Verify Email'
            )}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resending}
              className="text-purple-600 hover:text-purple-500 disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EmailVerifier />
    </Suspense>
  );
}