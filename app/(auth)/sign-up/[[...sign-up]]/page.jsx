"use client";
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
 
export default function Page() {
  return(
    <section className="min-h-screen bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Left Side - Left Paw Image */}
        <section className="relative flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 lg:col-span-7 lg:h-full xl:col-span-7">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-300 rounded-full opacity-10"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center w-full h-full p-8">
            <div className="max-w-lg w-full">
              <Image
                src="/Left-paw.png"
                alt="Left Paw"
                width={500}
                height={500}
                className="w-full h-auto object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-white text-2xl font-bold mb-2">
              Join Solacely Today!
            </h2>
            <p className="text-white/80 text-lg">
              Create your account and get started
            </p>
          </div>
        </section>

        {/* Right Side - Sign Up Form */}
        <main className="relative flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-5 lg:px-16 lg:py-12 xl:col-span-5 bg-white">
          {/* Logo in top right corner */}
          <div className="absolute top-6 right-6">
            <div className="flex flex-col items-center">
              <Image
                src="/icons/logo.svg"
                alt="Logo"
                width={24}
                height={24}
                className="mb-1"
              />
              
            </div>
          </div>

          <div className="max-w-md w-full">
            {/* Sign Up Form */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Sign up to Solacely
              </h1>
            </div>

            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-[#521282] hover:bg-[#3d0e61] text-white",
                  card: "shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-50",
                  formFieldInput: "border border-gray-300 rounded-lg px-4 py-3",
                  formFieldLabel: "text-gray-700 font-medium",
                  footerActionLink: "text-[#521282] hover:text-[#3d0e61]"
                }
              }}
            />
          </div>
        </main>
      </div>
    </section>
  )
}