import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { useAuth } from "@/hooks/use-auth";
import api from "../../services/api";
import countryList from "country-list-with-dial-code-and-flag";
import { useToast } from "@/hooks/use-toast";

const STRONG_PASSWORD_MESSAGE = "Use 8+ characters with uppercase, lowercase, number, and special character";
const isStrongPassword = (value: string) =>
  value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);

export default function Profile() {
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/api/users/${user.id}`).then(({ data }) => setProfile(data.user)).catch(console.error);
  }, [user?.id]);

  if (!user) return null;
  const current = profile || user;

  const candidate = current.candidate;
  const isCandidate = Boolean(candidate);
  const value = (item: unknown) => Array.isArray(item) ? item.join(", ") || "—" : String(item ?? "—");
  const countryName = (item: unknown) => {
    const raw = String(item ?? "");
    const match = countryList.getAll().find((entry: any) => entry.countryCode === raw || entry.dialCode === raw);
    return match?.name || raw || "—";
  };
  const details = isCandidate ? [
    ["Email", candidate.email], ["Phone", candidate.phone], ["Current Location", countryName(candidate.currentLocation)],
    ["Country of Residence", countryName(candidate.country)], ["City", candidate.city], ["Current Role", candidate.currentRole],
    ["Preferred Role", candidate.preferredRole], ["Experience", candidate.yearsExperience != null ? `${candidate.yearsExperience} years` : null],
    ["English Level", candidate.englishLevel], ["Visa Status", candidate.visaStatus], ["LinkedIn", candidate.linkedinUrl],
    ["Expected Salary", candidate.expectedSalary], ["Availability", candidate.availability], ["Work Mode", candidate.preferredWorkMode],
    ["Career Preference", candidate.careerPreference], ["Languages", candidate.languagesKnown], ["Skills", candidate.skills],
  ] : [["Email", current.email], ["Mobile Number", current.mobile], ["Username", current.username], ["Company", current.company], ["Department", current.department], ["Designation", current.designation], ["Country", current.country], ["State", current.state], ["City", current.city], ["Status", current.status]];
  const startEditing = () => {
    const source = candidate || current;
    setForm({ ...source, fullName: source.fullName || current.fullName, mobile: source.phone || current.mobile, email: source.email || current.email, password: "", confirmPassword: "" });
    setEditing(true);
  };
  const updateField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const saveProfile = async () => {
    setSaving(true);
    try {
      const nameParts = String(form.fullName || "").trim().split(/\s+/);
      const payload: any = { email: form.email, mobile: form.mobile, fullName: form.fullName, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" "), username: form.username, company: form.company, department: form.department, designation: form.designation, country: form.country, state: form.state, city: form.city, role: current.role };
      if (form.password || form.confirmPassword) {
        if (form.password !== form.confirmPassword) throw new Error("Passwords do not match");
        if (!isStrongPassword(String(form.password))) throw new Error(STRONG_PASSWORD_MESSAGE);
        payload.password = form.password;
      }
      if (isCandidate) {
        const listFields = ["languagesKnown", "skills", "interestedSkills", "careerPreference", "preferredWorkMode"];
        const candidateProfile: any = { fullName: form.fullName, email: form.email, phone: form.mobile, currentLocation: form.currentLocation, country: form.country, city: form.city, currentRole: form.currentRole, preferredRole: form.preferredRole, targetRole: form.preferredRole, yearsExperience: Number(form.yearsExperience) || 0, englishLevel: form.englishLevel, visaStatus: form.visaStatus, euWorkEligible: Boolean(form.euWorkEligible), linkedinUrl: form.linkedinUrl, expectedSalary: form.expectedSalary, availability: form.availability, languagesKnown: form.languagesKnown, skills: form.skills, interestedSkills: form.interestedSkills, careerPreference: form.careerPreference, preferredWorkMode: form.preferredWorkMode };
        for (const key of listFields) candidateProfile[key] = String(candidateProfile[key] || "").split(",").map((item) => item.trim()).filter(Boolean);
        payload.candidateProfile = candidateProfile;
      }
      await api.put(`/api/users/${user.id}`, payload);
      const { data } = await api.get(`/api/users/${user.id}`);
      setProfile(data.user); setEditing(false); await refresh();
      toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
    } catch (error: any) {
      toast({ title: "Update failed", description: error?.response?.data?.error || error?.response?.data?.message || error?.message || "Could not update profile.", variant: "destructive" });
    } finally { setSaving(false); }
  };
  const editFields = isCandidate
    ? [["fullName", "Full Name"], ["email", "Email"], ["mobile", "Phone"], ["currentLocation", "Current Location"], ["country", "Country of Residence"], ["city", "City"], ["currentRole", "Current Role"], ["preferredRole", "Preferred Role"], ["yearsExperience", "Years of Experience"], ["englishLevel", "English Level"], ["visaStatus", "Visa Status"], ["linkedinUrl", "LinkedIn URL"], ["expectedSalary", "Expected Salary"], ["availability", "Availability"], ["languagesKnown", "Languages"], ["skills", "Skills"], ["interestedSkills", "Interested Skills"], ["careerPreference", "Career Preference"], ["preferredWorkMode", "Preferred Work Mode"], ["password", "New Password"], ["confirmPassword", "Confirm New Password"]]
    : [["fullName", "Full Name"], ["email", "Email"], ["mobile", "Mobile Number"], ["username", "Username"], ["company", "Company"], ["department", "Department"], ["designation", "Designation"], ["country", "Country"], ["state", "State"], ["city", "City"], ["password", "New Password"], ["confirmPassword", "Confirm New Password"]];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl p-6">
        <div className={`mb-6 overflow-hidden rounded-2xl border ${isCandidate ? "border-blue-300 bg-gradient-to-r from-[#10194d] via-[#172b70] to-[#2456a6]" : "border-blue-300 bg-gradient-to-r from-[#0d173f] via-[#172b70] to-[#1d467f]"} p-7 text-white shadow-lg`}>
          <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">ORN-AI {isCandidate ? "Candidate Profile" : "Employee Profile"}</p>
            <h1 className="text-3xl font-bold">{candidate?.fullName || current.fullName || "My Profile"}</h1>
            <p className="mt-2 text-white/80">{isCandidate ? "Your complete professional candidate profile" : "Your complete employee account details"}</p>
          </div>
          <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100" onClick={startEditing}>{editing ? "Viewing Profile" : "Edit Profile"}</button>
          </div>
        </div>
        {editing ? <div className="rounded-2xl border bg-white p-6 shadow-sm"><div className="mb-5"><h2 className="text-xl font-semibold">Edit Profile</h2><p className="text-sm text-slate-500">Update your details directly on this page.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{editFields.map(([key, label]) => <label key={key} className="text-sm font-medium text-slate-700">{label}<input className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" value={Array.isArray(form[key]) ? form[key].join(", ") : form[key] ?? ""} onChange={(e) => updateField(key, e.target.value)} /></label>)}</div><div className="mt-6 flex justify-end gap-3"><button className="rounded-lg border px-4 py-2" onClick={() => setEditing(false)}>Cancel</button><button className="rounded-lg bg-indigo-700 px-5 py-2 font-medium text-white disabled:opacity-60" disabled={saving} onClick={saveProfile}>{saving ? "Saving..." : "Save Changes"}</button></div></div> : <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold text-slate-900">Profile Details</h2><p className="text-sm text-slate-500">Information currently saved in your account</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCandidate ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-800"}`}>{isCandidate ? "Candidate" : current.role || "Employee"}</span></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map(([label, item]) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="break-words text-sm font-medium text-slate-800">{value(item)}</p></div>)}
          </div>
        </div>}
      </div>
    </Shell>
  );
}
