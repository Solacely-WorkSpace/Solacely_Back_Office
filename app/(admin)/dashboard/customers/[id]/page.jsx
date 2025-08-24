"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerRedirectPage({ params }) {
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // Redirect to the profile settings page
    router.push(`/dashboard/customers/${id}/profile-settings`);
  }, [router, id]);

  return (
    <div className="p-8 text-center">Redirecting to customer profile...</div>
  );
}
