/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', // For Django backend images
      '127.0.0.1', // For Django backend images
      // Remove 'supabase.co' domains
    ],
  },
};

export default nextConfig;
