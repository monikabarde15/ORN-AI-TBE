import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import api from "../../services/api";

export default function PaymentSuccess() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.candidateId) return;

    verifyPayment();
  }, [user]);

  const verifyPayment = async () => {
    try {
      const params = new URLSearchParams(
        window.location.search
      );

      const paymentId =
        window.location.pathname.split("/").pop();

      console.log("USER =>", user);
      console.log("PAYMENT ID =>", paymentId);

      // Candidate Data
      const { data: candidateData } =
        await api.get(
          `/api/candidates/${user?.candidateId}`
        );

      console.log(
        "CANDIDATE =>",
        candidateData
      );

      await api.post("/api/payment/verify", {
        paymentId,

        studentName:
          candidateData.fullName,

        studentEmail:
          candidateData.email,

        studentPhone:
          candidateData.phone,

        razorpay_payment_id:
          params.get(
            "razorpay_payment_id"
          ),

        razorpay_signature:
          params.get(
            "razorpay_signature"
          ),
      });

      window.location.href =
        `/candidate/${user.candidateId}/evaluation`;
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <h2 className="text-xl font-semibold">
          Verifying Payment...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  );
}