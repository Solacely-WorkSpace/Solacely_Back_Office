import { Outfit } from "next/font/google";
import { Roboto } from "next/font/google"

import "./globals.css";
import Provider from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Solacely",
  description: "Home Away From Home",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // Added weights
  variable: "--font-rob",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${roboto.className} `}>
        <Provider>
         <Toaster />

         {children}
        </Provider>
       </body>
    </html>
    </ClerkProvider>
  );
}
