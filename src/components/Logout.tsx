"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LogoutButton({
  className: className,
}: {
  className?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        toast.success("Logged out successfully!");
        router.push("/"); // Redirect to login page
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className={className}>
      <Button onClick={handleLogout} className="w-full">
        Logout
      </Button>
      <ToastContainer />
    </div>
  );
}
