import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shell } from "@/components/layout/Shell";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");

  const email = sessionStorage.getItem("verifyEmail");
  const handleVerify = async () => {
    try {
      const rawApiUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      const API_URL = rawApiUrl ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`) : "/api";

      // OTP Verify
      const res = await fetch(
        `${API_URL}/auth/verify-email`,
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
        `${API_URL}/candidates/${data.candidateId}/evaluation`,
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

  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found. Please register again.");
      return;
    }

    try {
      setResending(true);
      const rawApiUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
      const API_URL = rawApiUrl ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`) : "/api";

      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to resend OTP");
        return;
      }

      toast.success("A new 6-digit OTP code has been sent to your email!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-[#1652A0] text-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg text-white">ORN</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-semibold">AI</span>
            </div>
            <CardTitle className="text-xl font-bold text-white">Verify Your OTP</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-gray-600">
              Enter the 6-digit verification code sent to <strong className="text-gray-900">{email || "your email"}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Verification Code
              </label>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 focus:border-[#1652A0] focus:ring-2 focus:ring-[#1652A0]/20"
              />
            </div>

            <Button
              className="w-full bg-[#1652A0] hover:bg-[#124282] text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors"
              onClick={handleVerify}
            >
              Verify OTP & Continue
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-xs text-[#1652A0] font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? "Sending new OTP..." : "Didn't get the code? Resend OTP"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}