"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { login, verify2FA, is2FARequired } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.requires2FA) {
        setShowTwoFactor(true);
      } else {
        // Redirect to admin dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verify2FA(twoFactorCode);
      // Redirect to admin dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("2FA verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Validate email
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(value));
    }
    
    // Validate password (non-empty for now)
    if (name === "password") {
      setIsPasswordValid(value.length > 0);
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

        {/* Right Side - Sign In Form */}
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
          
          <div className="max-w-sm w-full mx-auto">  {/* Changed from max-w-md to max-w-sm and added mx-auto */}
            <div className="mb-10 text-center">  {/* Added text-center */}
              <h2 className="text-3xl font-bold text-gray-900">
                Sign in to Solacely
              </h2>
            </div>

            {!showTwoFactor ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-700 mb-2 uppercase"
                  >
                    EMAIL
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none ${isEmailValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                      placeholder="Email address"
                    />
                    {isEmailValid && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
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
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none ${isPasswordValid ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'}`}
                      placeholder="Enter password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isPasswordValid && (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-500 hover:text-green-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#521282] hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 flex items-center justify-center mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify2FA} className="space-y-6">
                <div>
                  <Label
                    htmlFor="twoFactorCode"
                    className="block text-sm font-medium text-gray-700 mb-2 uppercase"
                  >
                    Two-Factor Authentication Code
                  </Label>
                  <Input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    required
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your 2FA code"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#521282] hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}
