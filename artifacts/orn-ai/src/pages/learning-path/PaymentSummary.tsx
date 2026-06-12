import {
  CreditCard,
  Wallet,
  Copy,
  ExternalLink,
} from "lucide-react";

import { toast } from "sonner";

interface Props {
  subtotal: number;
  gst: number;
  total: number;
  paymentLink?: string;
  generatePaymentLink: () => void;
}

export default function PaymentSummary({
  subtotal,
  gst,
  total,
  paymentLink,
  generatePaymentLink,
}: Props) {

  const copyLink =
    async () => {
      if (!paymentLink) return;

      await navigator.clipboard.writeText(
        paymentLink
      );

      toast.success(
        "Payment Link Copied"
      );
    };

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <Wallet size={24} />
          </div>

          <div>
            <p className="text-sm text-green-100">
              Billing
            </p>

            <h2 className="text-xl font-bold">
              Payment Summary
            </h2>
          </div>

        </div>

      </div>

      <div className="p-5">

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span>
              GST (18%)
            </span>

            <span>
              ₹{gst}
            </span>
          </div>

        </div>

        <div className="mt-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

          <p className="text-blue-100">
            Total Payable
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            ₹{total}
          </h2>

        </div>

        {paymentLink && (

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium">
              Payment Link
            </label>

            <div className="rounded-2xl border bg-slate-50 p-3">

              <input
                value={
                  paymentLink
                }
                readOnly
                className="
                  w-full
                  bg-transparent
                  text-sm
                  outline-none
                "
              />

            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">

              <button
                onClick={
                  copyLink
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-blue-600
                  py-3
                  text-white
                "
              >
                <Copy
                  size={16}
                />
                Copy
              </button>

              <button
                onClick={() =>
                  window.open(
                    paymentLink,
                    "_blank"
                  )
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  py-3
                "
              >
                <ExternalLink
                  size={16}
                />
                Open
              </button>

            </div>

          </div>

        )}

        <button
          onClick={
            generatePaymentLink
          }
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-green-600
            py-4
            font-semibold
            text-white
          "
        >
          <CreditCard
            size={18}
          />
          Generate Payment Link
        </button>

      </div>

    </div>
  );
}
