import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const email = sessionStorage.getItem("verifyEmail");
  const handleVerify = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    // OTP Verify
    const res = await fetch(
      `${API_URL}api/auth/verify-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "OTP verification failed"
      );
      return;
    }

    // Candidate ID required
    if (!data.candidateId) {
      toast.error("Candidate ID not found");
      return;
    }

    // Generate Evaluation
    const evalRes = await fetch(
      `${API_URL}api/candidates/${data.candidateId}/evaluation`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!evalRes.ok) {
      const evalData = await evalRes.json();

      toast.error(
        evalData.error ||
          "Failed to generate evaluation"
      );
      return;
    }

    toast.success(
      "OTP Verified & Evaluation Generated"
    );

    // Redirect
    window.location.href = `/candidate/${data.candidateId}/evaluation`;

  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            OTP sent to <strong>{email}</strong>
          </p>

          <Input
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button className="w-full" onClick={handleVerify}>
            Verify OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}