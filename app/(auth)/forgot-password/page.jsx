"use client";
import React, { useState } from 'react';
import { authAPI } from '@/utils/api/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // email, verification, newPassword
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authAPI.requestPasswordReset(email);
      setStep('verification');
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Just validate the code format here, actual verification happens with password reset
      if (verificationCode.length < 4) {
        throw new Error('Invalid verification code');
      }
      setStep('newPassword');
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }
      
      await authAPI.confirmPasswordReset({
        email,
        code: verificationCode,
        password,
        password_confirm: confirmPassword
      });
      
      toast.success('Password reset successful!');
      router.push('/sign-in');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      toast.success('Verification code resent!');
    } catch (error) {
      toast.error(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-white flex">
      <div className="flex min-h-screen w-full">
        {/* Left Side - Background Image */}
        <section className="relative hidden lg:flex lg:w-1/2">
          <Image 
            src="/Bg.png" 
            alt="Background" 
            fill 
            className="object-cover"
            priority 
          />
          <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
            {/* Center image - property card illustration */}
              <div className="flex-grow flex items-center justify-center">
              <div className="relative w-[500px]">
                <Image 
                  src="/Frame 33337.png" 
                  alt="Solacely Illustration" 
                  width={450} 
                  height={450} 
                  className="object-contain" 
                  priority 
                />
              </div>
            </div>
          
          </div>
        </section>

        {/* Right Side - Form */}
        <main className="flex flex-col items-center justify-center px-8 py-8 sm:px-12 w-full lg:w-1/2 relative">
          <div className="absolute top-4 right-4">
            <div className="relative w-[140px] h-[32px]">
              <Image 
                src="/icons/Frame 33340.svg" 
                alt="Solacely Logo" 
                width={140}
                height={32}
                className="object-contain"
                priority 
              />
            </div>
          </div>
          
          <div className="max-w-sm w-full mx-auto">
            {step === 'email' && (
              <>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Forgot password
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    For security purposes, no withdrawals are permitted for 24 hours after password changed.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700 mb-2 uppercase"
                    >
                      ENTER YOUR ACCOUNT EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your email"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#521282] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Sending...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Link
                      href="/sign-in"
                      className="text-sm text-purple-600 hover:text-purple-500"
                    >
                      Nevermind, I got it
                    </Link>
                  </div>
                </form>
              </>
            )}

            {step === 'verification' && (
              <>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Security Verification
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    To secure your account, please complete the following verification.
                  </p>
                </div>

                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="verificationCode"
                      className="block text-xs font-medium text-gray-700 mb-2"
                    >
                      Enter the 6 digit code received by {email}
                    </Label>
                    <div className="grid grid-cols-6 gap-2">
                      {/* Six individual digit inputs for verification code */}
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <Input
                          key={index}
                          type="text"
                          maxLength="1"
                          className="w-full px-0 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={verificationCode[index] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              const newCode = verificationCode.split('');
                              newCode[index] = value;
                              setVerificationCode(newCode.join(''));
                              
                              // Auto-focus next input if value is entered
                              if (value && index < 5) {
                                const nextInput = document.querySelector(
                                  `input[name=verification-${index + 1}]`
                                );
                                if (nextInput) nextInput.focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace to go to previous input
                            if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                              const prevInput = document.querySelector(
                                `input[name=verification-${index - 1}]`
                              );
                              if (prevInput) prevInput.focus();
                            }
                          }}
                          name={`verification-${index}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-sm text-purple-600 hover:text-purple-500"
                    >
                      Resend code
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full bg-[#521282] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Verifying...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </>
            )}

            {step === 'newPassword' && (
              <>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    New Password
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Create a strong password for your account.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="block text-xs font-medium text-gray-700 mb-2 uppercase"
                    >
                      EMAIL
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="block text-xs font-medium text-gray-700 mb-2 uppercase"
                    >
                      PASSWORD
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className="block text-xs font-medium text-gray-700 mb-2 uppercase"
                    >
                      CONFIRM PASSWORD
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#521282] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center mt-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}