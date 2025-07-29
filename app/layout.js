import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solacely",
  description: "Your trusted platform for finding the perfect rental property",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
   
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
    
      </body>
    </html>
  );
}
