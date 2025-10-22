import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import Provider from '@/components/Provider';
import { Toaster } from 'sonner';
import { ToastProvider } from '@radix-ui/react-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solacely",
  description: "Your trusted platform for finding the perfect rental property",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <Provider>
              {children}
            </Provider>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
