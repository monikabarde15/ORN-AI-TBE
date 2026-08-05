import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Shell } from "@/components/layout/Shell";
import { Loader2 } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [, setLocation] = useLocation();

  const isSubmittingRef = useRef(false);

  const email = sessionStorage.getItem("verifyEmail");
  const pendingCv = sessionStorage.getItem("pendingCv");
  const pendingCvName = sessionStorage.getItem("pendingCvName");
  const pendingCandidateId = sessionStorage.getItem("pendingCandidateId");

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("No email found. Please register again.");
      setLocation("/register");
    }
  }, [email, setLocation]);

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const getApiUrl = () => {
    const rawApiUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    return rawApiUrl ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`) : "/api";
  };

  const handleVerify = async () => {
    if (isSubmittingRef.current) {
      console.log("Already submitting, skipping...");
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

    isSubmittingRef.current = true;
    setIsVerifying(true);
    const API_URL = getApiUrl();

    try {
      console.log("🔐 Verifying OTP for:", email);

      const res = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "OTP verification failed");
        setIsVerifying(false);
        isSubmittingRef.current = false;
        return;
      }

      console.log("✅ OTP verified:", data);
      toast.success("Email verified successfully!");

      const candidateId = data.candidateId || pendingCandidateId;
      console.log("📎 Candidate ID:", candidateId);

      // Upload CV if exists
      if (pendingCv && candidateId) {
        try {
          console.log("📤 Uploading CV...");
          const blob = dataURLtoBlob(pendingCv);
          const formData = new FormData();
          formData.append("file", blob, pendingCvName || "cv.pdf");

          const uploadRes = await fetch(`${API_URL}/candidates/${candidateId}/cv`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (uploadRes.ok) {
            console.log("✅ CV uploaded successfully");
            toast.success("CV uploaded successfully!");
            sessionStorage.removeItem("pendingCv");
            sessionStorage.removeItem("pendingCvName");
            sessionStorage.removeItem("pendingCandidateId");
          } else {
            const errData = await uploadRes.json();
            console.error("CV upload failed:", errData);
            toast.warning("CV upload failed. You can upload it later.");
          }
        } catch (cvError) {
          console.error("CV upload error:", cvError);
          toast.warning("CV upload failed. You can upload it later.");
        }
      }

      // Generate AI Evaluation
      if (candidateId) {
        try {
          console.log("🤖 Generating AI Evaluation...");
          const evalRes = await fetch(`${API_URL}/candidates/${candidateId}/evaluation`, {
            method: "POST",
            credentials: "include",
          });

          if (evalRes.ok) {
            console.log("✅ AI Evaluation generated");
            toast.success("AI Evaluation generated successfully!");
          } else {
            const evalData = await evalRes.json();
            console.error("Evaluation generation failed:", evalData);
            toast.warning("Evaluation will be generated shortly.");
          }
        } catch (evalError) {
          console.error("Evaluation error:", evalError);
          toast.warning("Evaluation will be generated shortly.");
        }
      }

      // Clear session data
      sessionStorage.removeItem("verifyEmail");
      sessionStorage.removeItem("candidateCode");

      // ✅ FORCE PAGE REFRESH - Option 1: window.location.href
      console.log("🔄 Redirecting with force refresh...");

      // ✅ Small delay then redirect with force refresh
      setTimeout(() => {
        if (candidateId) {
          // ✅ Force full page refresh
          window.location.href = `/candidate/${candidateId}/evaluation`;
        } else {
          window.location.href = `/dashboard`;
        }
      }, 500);

    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsVerifying(false);
      isSubmittingRef.current = false;
    } finally {
      setTimeout(() => {
        setIsVerifying(false);
        isSubmittingRef.current = false;
      }, 2000);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found. Please register again.");
      return;
    }

    try {
      setResending(true);
      const API_URL = getApiUrl();

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

      if (data.otp) {
        setOtp(data.otp);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Auto-submit on 6 digits
  useEffect(() => {
    if (otp.length === 6 && !isSubmittingRef.current) {
      console.log("🔄 Auto-submitting OTP...");
      const timer = setTimeout(() => {
        handleVerify();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp]);

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-[#1652A0] text-white p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg text-white">ORN</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-semibold">AI</span>
            </div>
            <CardTitle className="text-xl font-bold text-white">Verify Your Email</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-gray-600">
              Enter the 6-digit verification code sent to{" "}
              <strong className="text-gray-900">{email || "your email"}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Verification Code
              </label>
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base text-gray-900 text-center text-2xl tracking-[0.5em] focus:border-[#1652A0] focus:ring-2 focus:ring-[#1652A0]/20"
                maxLength={6}
                disabled={isVerifying}
                autoFocus
              />
            </div>

            <Button
              className="w-full bg-[#1652A0] hover:bg-[#124282] text-white font-semibold py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              onClick={handleVerify}
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP & Continue"
              )}
            </Button>

            {pendingCv && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                <span className="font-medium">📄 CV Pending:</span> {pendingCvName || "CV will be uploaded after verification"}
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || isVerifying}
                className="text-xs text-[#1652A0] font-semibold hover:underline disabled:opacity-50"
              >
                {resending ? (
                  <>
                    <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                    Sending new OTP...
                  </>
                ) : (
                  "Didn't get the code? Resend OTP"
                )}
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setLocation("/login")}
                className="text-xs text-gray-500 hover:text-[#1652A0]"
              >
                ← Back to Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}