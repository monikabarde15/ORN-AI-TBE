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
    <div className="overflow-hidden  border border-slate-200 bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
            <Wallet size={24} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Billing
            </p>

            <h2 className="text-lg font-semibold text-slate-900">
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

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">

          <p className="text-sm text-slate-500">
            Total Payable
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-900">
            ₹{total}
          </h2>

        </div>

        {paymentLink && (

          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium">
              Payment Link
            </label>

            <div className="rounded-xl border border-slate-200 bg-white p-3">

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
                  rounded-xl
                bg-blue-900
                hover:bg-blue-800 
                  transition
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
                  rounded-xl
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
