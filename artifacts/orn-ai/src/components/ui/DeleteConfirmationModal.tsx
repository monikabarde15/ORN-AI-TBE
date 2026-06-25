import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  open,
  onOpenChange,
  title = "Are you sure?",
  description =
    "This action cannot be undone. All values associated with this item will be lost.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-slate-900">
              {title}
            </h2>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-slate-500 max-w-sm">
              {description}
            </p>

            {/* Actions */}
            <div className="mt-8 flex w-full flex-col gap-4">
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="h-12 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Deleting..." : confirmText}
              </Button>

              <Button
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
                className="h-12 rounded-xl border-slate-300"
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}