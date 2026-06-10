import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import api from "../../services/api";

export default function PaymentPage() {
const { user, isLoading } = useAuth();
console.log("user=",user);

  const paymentId =
    window.location.pathname.split("/").pop();

  useEffect(() => {
  if (!paymentId) return;

  // auth load hone do
  if (isLoading) return;

  // auth load ho gaya aur user nahi mila
  if (!user?.id) {
    window.location.href =
      `/login?redirect=/payment/${paymentId}`;
    return;
  }

  // user mil gaya
  loadPayment();

}, [user, isLoading, paymentId]);
  const loadPayment = async () => {
    try {
      const { data } = await api.get(
        `/api/payment/${paymentId}`
      );

      console.log("PAYMENT =>", data);
        sessionStorage.setItem(
        "paymentUser",
        JSON.stringify({
            name: user?.fullName,
            email: user?.email,
            phone: user?.phone,
        })
        );
      if (data?.payment?.paymentLink) {
        window.location.href =
          data.payment.paymentLink;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      Redirecting to payment...
    </div>
  );
}