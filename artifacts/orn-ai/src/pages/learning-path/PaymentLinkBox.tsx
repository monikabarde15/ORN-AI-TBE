import {
  Link2,
  Copy,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  paymentLink: string;
}

export default function PaymentLinkBox({
  paymentLink,
}: Props) {
  if (!paymentLink) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        paymentLink
      );

      toast.success(
        "Payment Link Copied"
      );
    } catch {
      toast.error(
        "Failed to copy link"
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-green-200 bg-white shadow-sm">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <p className="text-sm text-green-100">
              Payment Ready
            </p>

            <h2 className="text-lg font-bold">
              Payment Link Generated
            </h2>
          </div>

        </div>

      </div>

      {/* Body */}
      <div className="p-5">

        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Link2 size={16} />
          Payment URL
        </label>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">

          <input
            value={paymentLink}
            readOnly
            className="
              w-full
              bg-transparent
              text-sm
              text-slate-600
              outline-none
            "
          />

        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">

          <button
            onClick={copyLink}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-blue-600
              py-3
              font-medium
              text-white
              transition-all
              hover:bg-blue-700
            "
          >
            <Copy size={16} />
            Copy Link
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
              border-slate-300
              bg-white
              py-3
              font-medium
              text-slate-700
              transition-all
              hover:bg-slate-50
            "
          >
            <ExternalLink size={16} />
            Open Link
          </button>

        </div>

      </div>

    </div>
  );
}