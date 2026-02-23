"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Legacy route — redirects to the new /dues/pay page
export default function PayDuesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dues/pay");
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-electric" />
    </div>
  );
}
