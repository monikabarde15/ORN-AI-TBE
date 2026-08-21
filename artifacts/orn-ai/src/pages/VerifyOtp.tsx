import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shell } from "@/components/layout/Shell";
import {
  Loader2,
  CheckCircle2,
  Award,
  FileText,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Briefcase,
  ClipboardCheck,
  BarChart3,
  HelpCircle
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const DEFAULT_ONBOARDING_QUESTIONS: Question[] = [
  {
    id: 0,
    question: "Checking mcq: What is the primary purpose of Version Control Systems like Git?",
    options: [
      "To compile source code into binary executables",
      "To track changes, collaborate, and manage code history",
      "To replace automated database backups",
      "To run cloud virtual machines"
    ],
    correctAnswer: 1,
  },
  {
    id: 1,
    question: "checking true false: Continuous Integration (CI) automatically builds and tests code on every commit.",
    options: ["True", "False"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "checking short questions: Which HTTP status code represents successful resource retrieval?",
    options: ["200 OK", "404 Not Found", "500 Server Error", "403 Forbidden"],
    correctAnswer: 0,
  },
  {
    id: 3,
    question: "how are you?: Which technology is primarily used for containerizing applications?",
    options: ["Docker", "CSS", "Photoshop", "None of the above"],
    correctAnswer: 0,
  },
];

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<"otp" | "onboarding" | "assessment" | "results">("otp");

  const [candidateDetails, setCandidateDetails] = useState<{
    id?: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // Assessment States
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_ONBOARDING_QUESTIONS);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    total: number;
    score: number;
    wrong: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const email = sessionStorage.getItem("verifyEmail");
  const pendingCv = sessionStorage.getItem("pendingCv");
  const pendingCvName = sessionStorage.getItem("pendingCvName");
  const pendingCandidateId = sessionStorage.getItem("pendingCandidateId");

  // Redirect if no email
  useEffect(() => {
    if (!email && step === "otp") {
      toast.error("No email found. Please register again.");
      setLocation("/register");
    }
  }, [email, setLocation, step]);

  const getApiUrl = () => {
    const rawApiUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    return rawApiUrl ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`) : "/api";
  };

  // ✅ Fetch Admin Created Assessments from Database
  useEffect(() => {
    const fetchAdminAssessments = async () => {
      try {
        const API_URL = getApiUrl();
        const res = await fetch(`${API_URL}/assessments`, { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        const list = json.data || json.assessments || [];
        if (Array.isArray(list) && list.length > 0) {
          const matched =
            list.find(
              (a: any) =>
                a.status === "Published" ||
                (candidateDetails?.role &&
                  a.targetRole?.toLowerCase() === candidateDetails.role.toLowerCase()) ||
                (candidateDetails?.role &&
                  a.assessmentName?.toLowerCase().includes(candidateDetails.role.toLowerCase()))
            ) || list[0];

          if (matched) {
            const titleName = matched.assessmentName ? matched.assessmentName : `${candidateDetails?.role || "Skill"} Assessment`;
            setAssessmentTitle(titleName);

            let qList = matched.questions || [];
            if ((!qList || qList.length === 0) && matched.id) {
              try {
                const singleRes = await fetch(`${API_URL}/assessments/${matched.id}`, { credentials: "include" });
                if (singleRes.ok) {
                  const singleJson = await singleRes.json();
                  qList = singleJson.data?.questions || [];
                }
              } catch (singleErr) {
                console.error("Error fetching single assessment questions:", singleErr);
              }
            }

            if (Array.isArray(qList) && qList.length > 0) {
              setQuestions(
                qList.map((q: any, idx: number) => {
                  let optArr: string[] = [];
                  if (Array.isArray(q.options) && q.options.length > 0) {
                    optArr = q.options;
                  } else if (typeof q.options === "object" && q.options !== null) {
                    optArr = Object.values(q.options);
                  }

                  if (!optArr || optArr.length === 0) {
                    optArr = ["Option A", "Option B", "Option C", "Option D"];
                  }

                  return {
                    id: idx,
                    question: q.question || q.text || `Question ${idx + 1}`,
                    options: optArr,
                    correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : (typeof q.correctOptionIndex === "number" ? q.correctOptionIndex : 0),
                  };
                })
              );
              return;
            }

            // Fallback questions matching Admin Assessment Editor defaults
            setQuestions([
              {
                id: 0,
                question: "Enter your question here",
                options: [
                  "Option A",
                  "Option B",
                  "Option C",
                  "Option D"
                ],
                correctAnswer: 0,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load admin assessments:", err);
      }
    };

    fetchAdminAssessments();
  }, [candidateDetails]);

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

  // ✅ Verify - ONLY on button click
  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email not found");
      return;
    }

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
        return;
      }

      console.log("✅ OTP verified:", data);
      toast.success("Email verified successfully!");

      const candidateId = data.candidateId || pendingCandidateId || data.user?.candidateId;

      // Upload CV if exists
      if (pendingCv && candidateId) {
        try {
          const blob = dataURLtoBlob(pendingCv);
          const formData = new FormData();
          formData.append("file", blob, pendingCvName || "cv.pdf");

          await fetch(`${API_URL}/candidates/${candidateId}/cv`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          sessionStorage.removeItem("pendingCv");
          sessionStorage.removeItem("pendingCvName");
          sessionStorage.removeItem("pendingCandidateId");
        } catch (cvError) {
          console.error("CV upload error:", cvError);
        }
      }

      // Generate AI Evaluation
      if (candidateId) {
        try {
          await fetch(`${API_URL}/candidates/${candidateId}/evaluation`, {
            method: "POST",
            credentials: "include",
          });
        } catch (evalError) {
          console.error("Evaluation error:", evalError);
        }
      }

      const regName = sessionStorage.getItem("registerName") || data.fullName || data.user?.fullName || email.split("@")[0];
      const regRole = sessionStorage.getItem("registerRole") || data.targetRole || data.user?.role || "Full Stack & AI Specialist";

      setCandidateDetails({
        id: candidateId,
        name: regName,
        email: email,
        role: regRole,
      });

      // Clear OTP session keys
      sessionStorage.removeItem("verifyEmail");
      sessionStorage.removeItem("candidateCode");

      // Transition to Welcome Onboarding Screen
      setStep("onboarding");
      setIsVerifying(false);

    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found. Please register again.");
      return;
    }

    if (resending) return;

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
        setResending(false);
        return;
      }

      toast.success("New OTP sent to your email!");
      if (data.otp) {
        setOtp(data.otp);
      }
      setResending(false);
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Failed to resend OTP");
      setResending(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  // Submit Assessment Logic
  const handleSubmitAssessment = async () => {
    setIsSubmittingAssessment(true);

    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 1;
      }
    });

    const total = questions.length;
    const wrong = total - score;
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60;

    const resObj = {
      total,
      score,
      wrong,
      percentage,
      passed,
    };

    setAssessmentResult(resObj);

    if (candidateDetails?.id) {
      try {
        const API_URL = getApiUrl();
        await fetch(`${API_URL}/training/assignments/${candidateDetails.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status: "in_progress",
            progressPct: Math.max(25, percentage),
            finalReadinessNote: `Pre-onboarding assessment completed with score: ${percentage}%.`,
          }),
        });
      } catch (err) {
        console.error("Failed to save assessment attempt:", err);
      }
    }

    setStep("results");
    setIsSubmittingAssessment(false);
    toast.success("Assessment submitted successfully!");
  };

  const goToEvaluation = () => {
    if (candidateDetails?.id) {
      window.location.href = `/candidate/${candidateDetails.id}/evaluation`;
    } else {
      window.location.href = `/candidate-evaluation`;
    }
  };

  return (
    <Shell>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">

        {/* STEP 1: OTP INPUT FORM */}
        {step === "otp" && (
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
                <p className="text-xs text-gray-400 mt-1">
                  Enter the 6-digit code sent to your email
                </p>
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
        )}

        {/* STEP 2: WELCOME ONBOARDING PAGE */}
        {step === "onboarding" && candidateDetails && (
          <Card className="w-full max-w-xl bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 text-white text-center relative overflow-hidden">
              <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-3 border border-emerald-400/30">
                <CheckCircle2 className="size-8" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs px-3 py-1 mb-2">
                Verification Successful
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome to ORN AI! 🎉
              </h2>
              <p className="text-sm text-blue-100 mt-1 max-w-md mx-auto">
                Your account registration and email verification are complete. Please select your next step below.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Candidate Details Card */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-blue-600" /> Registered Candidate Profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-sm">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                      <User className="size-3 text-blue-600" /> Name
                    </div>
                    <div className="font-bold text-slate-900 truncate">{candidateDetails.name}</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                      <Mail className="size-3 text-blue-600" /> Email
                    </div>
                    <div className="font-bold text-slate-900 truncate">{candidateDetails.email}</div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-xs text-slate-500 flex items-center gap-1 mb-0.5">
                      <Briefcase className="size-3 text-blue-600" /> Profile / Role
                    </div>
                    <div className="font-bold text-slate-900 truncate">{candidateDetails.role}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-500 text-center uppercase tracking-wider">
                  Choose your next action to proceed
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* <Button
                    size="lg"
                    className="h-14 bg-blue-900 hover:bg-[#0B1F4D] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    onClick={() => setStep("assessment")}
                  >
                    <ClipboardCheck className="size-5" />
                    Go to Assessments ✍️
                  </Button> */}

                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
                    onClick={goToEvaluation}
                  >
                    <BarChart3 className="size-5 text-blue-900" />
                    Go to My Evaluation 📊
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: INTERACTIVE ASSESSMENT PORTAL */}
        {step === "assessment" && candidateDetails && (
          <Card className="w-full max-w-2xl bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <CardHeader className="bg-blue-900 text-white p-6 flex flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/20 text-white text-xs px-2.5 py-0.5 border-0">
                    Mandatory Readiness Exam
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {assessmentTitle || `${candidateDetails.role} Skill Assessment`}
                </CardTitle>
                <CardDescription className="text-blue-100 text-xs mt-0.5">
                  Question {currentQIdx + 1} of {questions.length} · Answer all questions to complete registration verification
                </CardDescription>
              </div>

              <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 font-bold text-sm">
                {currentQIdx + 1}/{questions.length}
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Question Card */}
              {questions[currentQIdx] && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <HelpCircle className="size-3.5" /> Question {currentQIdx + 1}
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {questions[currentQIdx].question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5">
                    {questions[currentQIdx].options.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[currentQIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [currentQIdx]: oIdx,
                            }))
                          }
                          className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 ${isSelected
                              ? "bg-blue-50 border-blue-900 text-blue-900 shadow-sm font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`size-6 rounded-full text-xs flex items-center justify-center font-bold ${isSelected
                                  ? "bg-blue-900 text-white"
                                  : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="size-4 text-blue-900 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentQIdx === 0}
                  onClick={() => setCurrentQIdx((prev) => Math.max(0, prev - 1))}
                  className="h-10 text-xs font-semibold px-4"
                >
                  Previous Question
                </Button>

                {currentQIdx < questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQIdx((prev) => prev + 1)}
                    className="h-10 text-xs font-bold bg-blue-900 hover:bg-[#0B1F4D] text-white px-5 gap-1.5"
                  >
                    Next Question <ArrowRight className="size-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={isSubmittingAssessment || Object.keys(selectedAnswers).length < questions.length}
                    onClick={handleSubmitAssessment}
                    className="h-10 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-6 gap-1.5 shadow-md"
                  >
                    {isSubmittingAssessment ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" /> Save & Submit Answers
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: ASSESSMENT RESULTS & DIRECT EVALUATION LINK */}
        {step === "results" && assessmentResult && candidateDetails && (
          <Card className="w-full max-w-xl bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-8 text-white text-center">
              <div className="size-16 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-3 border border-amber-300/30">
                <Award className="size-8" />
              </div>
              <Badge className="bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs px-3 py-1 mb-2">
                {assessmentResult.passed ? "Assessment Passed 🎉" : "Assessment Completed"}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Assessment Results Summary
              </h2>
              <p className="text-xs text-blue-100 mt-1">
                Candidate: {candidateDetails.name} ({candidateDetails.role})
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Detailed Question Performance Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border text-center">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Questions</span>
                  <span className="font-extrabold text-slate-900 text-base">{assessmentResult.total}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-emerald-700 block text-[10px] uppercase font-bold">Correct</span>
                  <span className="font-extrabold text-emerald-700 text-base">{assessmentResult.score}</span>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-center">
                  <span className="text-red-700 block text-[10px] uppercase font-bold">Incorrect</span>
                  <span className="font-extrabold text-red-700 text-base">{assessmentResult.wrong}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-900 text-center text-white">
                  <span className="text-blue-200 block text-[10px] uppercase font-bold">Final Score</span>
                  <span className="font-extrabold text-white text-base">{assessmentResult.percentage}%</span>
                </div>
              </div>

              {/* Direct Navigation Button */}
              <div className="pt-2">
                <Button
                  size="lg"
                  className="w-full h-14 bg-blue-900 hover:bg-[#0B1F4D] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  onClick={goToEvaluation}
                >
                  <BarChart3 className="size-5" />
                  Go to My Evaluation 📊
                  <ArrowRight className="size-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </Shell>
  );
}