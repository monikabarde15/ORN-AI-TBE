import { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useAuth } from "@/hooks/use-auth";
import api from "../../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const STRONG_PASSWORD_MESSAGE =
  "Use 8+ characters with uppercase, lowercase, number, and special character.";

const isStrongPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

export default function ChangePassword() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(STRONG_PASSWORD_MESSAGE);
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/auth/change-password`, { password: newPassword });
      await refresh();
      setMessage("Password changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Password updated", description: "Your password has been updated." });
    } catch (error: any) {
      setError(error?.response?.data?.error || error?.response?.data?.message || error?.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-6 rounded-2xl border bg-white shadow-sm p-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Change Password</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Update your account password securely.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 mb-4">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
                className="mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                className="mt-2"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              {STRONG_PASSWORD_MESSAGE}
            </p>

            <Button type="submit" disabled={saving} className="mt-2">
              {saving ? "Saving..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </Shell>
  );
}
