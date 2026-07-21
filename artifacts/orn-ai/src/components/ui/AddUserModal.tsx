"use client";

import React, { useState } from "react";
import  { useEffect } from "react";

import { Toaster, toast } from "react-hot-toast";
import api from "../../../services/api";
import countryList from "country-list-with-dial-code-and-flag";

import {
    X,
    UserPlus,
    Building2,
    Shield,
    MapPin,
    KeyRound,
} from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;

  mode?: "create" | "edit";
  initialData?: any;
  lockRole?: boolean;
  hideAccessOptions?: boolean;
}

const Input = ({
    label,
    required,
    ...props
}: any) => (
    <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
            {required && (
                <span className="ml-1 text-red-500">*</span>
            )}
        </label>

        <input
            {...props}
            className="
        w-full
        rounded-xl
        border
        border-slate-300
        px-4
        py-3
        text-sm
        outline-none
        transition
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
      "
        />
    </div>
);

const Select = ({
    label,
    children,
    ...props
}: any) => (
    <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
            {label}
        </label>

        <select
            {...props}
            className="
        w-full
        rounded-xl
        border
        border-slate-300
        px-4
        py-3
        text-sm
        outline-none
        transition
        focus:border-indigo-500
        focus:ring-2
        focus:ring-indigo-100
      "
        >
            {children}
        </select>
    </div>
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[1-9]\d{6,14}$/;
const STRONG_PASSWORD_MESSAGE = "Use 8+ characters with uppercase, lowercase, number, and special character";

const normalizePhone = (value: string) => value.trim().replace(/[\s().-]/g, "");

const isValidPhone = (value: string) => {
  const normalized = normalizePhone(value);
  return PHONE_PATTERN.test(normalized) && !/^(\+?)(\d)\2+$/.test(normalized);
};

const isStrongPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);



export default function AddUserModal({
  open,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
  lockRole = false,
  hideAccessOptions = false,
}: AddUserModalProps) {
    const countryName = (value: string) => {
      const match = countryList.getAll().find((item: any) => item.countryCode === value || item.dialCode === value);
      return match?.name || value;
    };
    const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
    const downloadCvUrl = `${apiBaseUrl.endsWith("/api") ? apiBaseUrl : `${apiBaseUrl}/api`}/candidates/${initialData?.candidate?.id}/cv-file`;
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [candidateResume, setCandidateResume] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        username: "",
        employeeId: "",

        password: "",
        confirmPassword: "",

        role: "recruiter",
        status: "Active",

        company: "",
        department: "",
        designation: "",

        country: "",
        state: "",
        city: "",

        sendWelcomeEmail: true,
        forcePasswordReset: true,
        emailCredentials: true,

        currentLocation: "",
        currentRole: "",
        preferredRole: "",
        yearsExperience: "",
        englishLevel: "B2",
        visaStatus: "requires_sponsorship",
        euWorkEligible: false,
        linkedinUrl: "",
        skills: "",
        interestedSkills: "",
        languagesKnown: "",
        careerPreference: "",
        preferredWorkMode: "",
        expectedSalary: "",
        availability: "",
        candidateFullName: "",
    });
    useEffect(() => {
  if (mode === "edit" && initialData) {
    const candidate = initialData.candidate || {};
    const savedFullName = candidate.fullName || initialData.fullName || "";
    const nameParts = savedFullName.trim().split(/\s+/).filter(Boolean);
    const firstName = candidate.fullName ? nameParts[0] || "" : initialData.firstName || nameParts[0] || "";
    setFormData((prev) => ({
      ...prev,

      firstName,
      middleName: candidate.fullName ? (nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "") : initialData.middleName || "",
      lastName: candidate.fullName ? (nameParts.length > 1 ? nameParts[nameParts.length - 1] : "") : initialData.lastName || nameParts.slice(1).join(" ") || "",

      email: candidate.email || initialData.email || "",
      mobile: initialData.mobile || initialData.phone || candidate.phone || candidate.mobile || "",

      username: initialData.username || firstName,
      employeeId: initialData.employeeId || "",

      company: candidate.company || initialData.company || "",
      department: initialData.department || candidate.department || "",
      designation: candidate.targetRole || initialData.designation || "",

      country: countryName(candidate.country || initialData.country || ""),
      state: candidate.state || initialData.state || "",
      city: candidate.city || initialData.city || candidate.currentLocation || "",

      currentLocation: countryName(candidate.currentLocation || ""),
      currentRole: candidate.currentRole || "",
      preferredRole: candidate.preferredRole || "",
      yearsExperience: candidate.yearsExperience != null ? String(candidate.yearsExperience) : "",
      englishLevel: candidate.englishLevel || "B2",
      visaStatus: candidate.visaStatus || "requires_sponsorship",
      euWorkEligible: Boolean(candidate.euWorkEligible),
      linkedinUrl: candidate.linkedinUrl || "",
      skills: Array.isArray(candidate.skills) ? candidate.skills.join(", ") : "",
      interestedSkills: Array.isArray(candidate.interestedSkills) ? candidate.interestedSkills.join(", ") : "",
      languagesKnown: Array.isArray(candidate.languagesKnown) ? candidate.languagesKnown.join(", ") : "",
      careerPreference: Array.isArray(candidate.careerPreference) ? candidate.careerPreference.join(", ") : "",
      preferredWorkMode: Array.isArray(candidate.preferredWorkMode) ? candidate.preferredWorkMode.join(", ") : "",
      expectedSalary: candidate.expectedSalary || "",
      availability: candidate.availability || "",
      candidateFullName: savedFullName,

      role: initialData.role === "Student" ? "candidate" : (initialData.role || "recruiter"),
      status: initialData.status || "Active",

      password: "",
      confirmPassword: "",
    }));
  }
}, [mode, initialData]);

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (name === "candidateFullName") {
            const parts = value.trim().split(/\s+/).filter(Boolean);
            setFormData((prev) => ({
                ...prev,
                candidateFullName: value,
                firstName: parts[0] || "",
                middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
                lastName: parts.length > 1 ? parts[parts.length - 1] : "",
            }));
            return;
        }

        if (
            name === "password" ||
            name === "confirmPassword"
        ) {
            setGeneratedPassword("");
        }

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    };

    const generatePassword = () => {
        const password =
            "Aa1!" + Math.random().toString(36).slice(-10);

        setGeneratedPassword(password);

        setFormData((prev) => ({
            ...prev,
            password,
            confirmPassword: password,
        }));
    };
const role = formData.role;
const isCandidateEdit = mode === "edit" && (initialData?.candidate || role === "candidate");
const theme = isCandidateEdit
  ? { icon: "bg-violet-100 text-violet-600", button: "bg-violet-700 hover:bg-violet-800", accent: "border-violet-200" }
  : { icon: "bg-indigo-100 text-indigo-600", button: "bg-indigo-700 hover:bg-indigo-800", accent: "border-indigo-200" };
const handleSubmit = async () => {
  try {
        if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email
        ) {
        toast.error("Please fill all required fields");
        return;
        }

        if (!EMAIL_PATTERN.test(formData.email.trim()) || formData.email.trim().length > 254) {
          toast.error("Please enter a valid email address");
          return;
        }

        if (!isValidPhone(formData.mobile)) {
          toast.error("Please enter a valid mobile number with 7 to 15 digits");
          return;
        }

        if (
        mode === "create" &&
        !formData.password
        ) {
        toast.error("Password is required");
        return;
        }
    if (formData.password && !isStrongPassword(formData.password)) {
      toast.error(STRONG_PASSWORD_MESSAGE);
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
  toast.error("Passwords do not match");
  return;
}

    const roleMap: Record<string, "candidate" | "recruiter" | "admin"> = {
      Student: "candidate",
      Recruiter: "recruiter",
      Instructor: "recruiter",
      Mentor: "recruiter",
      "Content Manager": "admin",
      Admin: "admin",
      "Super Admin": "admin",
    };

    const payload: any = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.replace(/\s+/g, " ").trim(),

        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,

        mobile: normalizePhone(formData.mobile),
        username: formData.username,
        employeeId: formData.employeeId,

        company: formData.company,
        department: formData.department,
        designation: formData.designation,

        country: formData.country,
        state: formData.state,
        city: formData.city,

        status: formData.status,

        sendWelcomeEmail: formData.sendWelcomeEmail,
        forcePasswordChange: formData.forcePasswordReset,
        emailCredentials: formData.emailCredentials,

        role: roleMap[formData.role] || formData.role,
        gdprConsent: true,
        createdByAdmin: true,
        };

    // Candidate/Student only
    if (role === "candidate" || role === "Student" || initialData?.candidate) {
      payload.candidateProfile = {
        fullName: payload.fullName,
        email: formData.email,
        phone: normalizePhone(formData.mobile),
        country: formData.country,

        currentLocation: formData.currentLocation,
        city: formData.city,
        currentRole: formData.currentRole,
        preferredRole: formData.preferredRole,
        targetRole: formData.preferredRole || formData.designation || "Student",
        yearsExperience: Number(formData.yearsExperience) || 0,
        visaStatus: formData.visaStatus,
        englishLevel: formData.englishLevel,
        euWorkEligible: formData.euWorkEligible,
        linkedinUrl: formData.linkedinUrl,
        skills: formData.skills.split(",").map((item) => item.trim()).filter(Boolean),
        interestedSkills: formData.interestedSkills.split(",").map((item) => item.trim()).filter(Boolean),
        languagesKnown: formData.languagesKnown.split(",").map((item) => item.trim()).filter(Boolean),
        careerPreference: formData.careerPreference.split(",").map((item) => item.trim()).filter(Boolean),
        preferredWorkMode: formData.preferredWorkMode.split(",").map((item) => item.trim()).filter(Boolean),
        expectedSalary: formData.expectedSalary,
        availability: formData.availability,
      };
    }

    let data;

if (mode === "edit") {
  const response = await api.put(
    `/api/users/${initialData.id}`,
    payload
  );

  data = response.data;

  if (candidateResume && initialData?.candidate?.id) {
    const uploadData = new FormData();
    uploadData.append("file", candidateResume);
    await api.post(`/api/candidates/${initialData.candidate.id}/cv-file`, uploadData);
  }

  toast.success("User updated successfully");
} else {
  const response = await api.post(
    "/api/auth/register",
    payload
  );

  data = response.data;

  toast.success("User created successfully");
}

    onSubmit?.(data);
   setTimeout(() => {
    window.location.reload();
    }, 2000);

    onClose();
  } catch (err: any) {
    console.error(err);

    toast.error(
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      "Failed to create user"
    );
  }
};

    return (
        <div
            className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
        >
            <Toaster position="top-right" />

            <div
                className="
          flex
          max-h-[95vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
            >
                {/* Header */}
                <div
            className={`
            flex
            items-start
            justify-between
            border-b
            border-slate-200
            px-8
            py-6
            ${isCandidateEdit ? "bg-violet-50/60" : "bg-slate-50/70"}
          `}
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <div
                                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${theme.icon.split(" ")[0]}
                `}
                            >
                                <UserPlus
                                    size={22}
                                    className={theme.icon.split(" ")[1]}
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                     {isCandidateEdit ? "Edit Candidate" : mode === "edit" ? "Edit User" : "Add New User"}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {isCandidateEdit
                                      ? "Update the complete candidate profile."
                                      : "Register staff users and assign their role and access."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="
              rounded-xl
              p-2
              text-slate-500
              hover:bg-slate-100
            "
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto bg-slate-50/80 px-6 py-7 sm:px-10">
                    <div className="mx-auto max-w-5xl space-y-10">

                        <div className={isCandidateEdit ? "hidden" : "contents"}>

                        {/* Personal */}
                        <section>
                            <div className="mb-5 flex items-center gap-2">
                                <UserPlus
                                    size={16}
                                    className="text-indigo-600"
                                />

                                <h3
                                    className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                                >
                                    Personal Information
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <Input
                                    label="First Name"
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Middle Name"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Last Name"
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Email Address"
                                    required
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Mobile Number"
                                    required
                                    name="mobile"
                                    type="tel"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-5 grid gap-5 md:grid-cols-1">
                                <Input
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />

                                {/* <Input
                                    label="Employee / Student ID"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                /> */}
                            </div>
                        </section>

                        {/* Account */}
                        <section className="mt-10 border-t border-slate-200 pt-8">
                            <div className="mb-5 flex items-center gap-2">
                                <KeyRound
                                    size={16}
                                    className="text-indigo-600"
                                />

                                <h3
                                    className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                                >
                                    Account Information
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Password"
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Confirm Password"
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={generatePassword}
                                className="
    mt-4
    rounded-xl
    border
    border-slate-300
    px-4
    py-2
    text-sm
    font-medium
    hover:bg-slate-50
  "
                            >
                                Generate Password
                            </button>

                            {generatedPassword && (
                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase text-slate-500">
                                        Generated Password
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="font-mono text-sm text-slate-900">
                                            {generatedPassword}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    generatedPassword
                                                )
                                            }
                                            className="
          rounded-lg
          border
          border-slate-300
          px-3
          py-1.5
          text-xs
          font-medium
          hover:bg-white
        "
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Role */}
                        <section className="mt-10 border-t border-slate-200 pt-8">
                            <div className="mb-5 flex items-center gap-2">
                                <Shield
                                    size={16}
                                    className="text-indigo-600"
                                />

                                <h3
                                    className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                                >
                                    Role & Status
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Select
                                    label="Role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    disabled={lockRole}
                                >
                                    {/* <option>Student</option> */}
                                    {isCandidateEdit && <option value="candidate">Candidate</option>}
                                    <option value="recruiter">Recruiter</option>
                                    <option value="instructor">Instructor</option>
                                    <option value="mentor">Mentor</option>
                                    <option value="content_manager">Content Manager</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </Select>

                                <Select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Pending</option>
                                </Select>
                            </div>
                        </section>

                        {/* Organization */}
                        <section className="mt-10 border-t border-slate-200 pt-8">
                            <div className="mb-5 flex items-center gap-2">
                                <Building2
                                    size={16}
                                    className="text-indigo-600"
                                />

                                <h3
                                    className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                                >
                                    Organization Details
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-5">
                                <Input
                                    label="Designation"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Location */}
                        <section className="mt-10 border-t border-slate-200 pt-8">
                            <div className="mb-5 flex items-center gap-2">
                                <MapPin
                                    size={16}
                                    className="text-indigo-600"
                                />

                                <h3
                                    className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-500
                  "
                                >
                                    Location
                                </h3>
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                <Input
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Access Options */}
                        {!hideAccessOptions && <section className="mt-10 border-t border-slate-200 pt-8">
                            <h3
                                className="
                  mb-5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-500
                "
                            >
                                Access Options
                            </h3>

                            <div className="space-y-4">
                                {[
                                    {
                                        key: "sendWelcomeEmail",
                                        label: "Send Welcome Email",
                                    },
                                    {
                                        key: "forcePasswordReset",
                                        label:
                                            "Force Password Change on First Login",
                                    },
                                    {
                                        key: "emailCredentials",
                                        label:
                                            "Email Account Credentials",
                                    },
                                ].map((item) => (
                                    <label
                                        key={item.key}
                                        className="flex items-center gap-3"
                                    >
                                        <input
                                            type="checkbox"
                                            name={item.key}
                                            checked={
                                                formData[
                                                item.key as keyof typeof formData
                                                ] as boolean
                                            }
                                            onChange={handleChange}
                                        />

                                        <span className="text-sm text-slate-700">
                                            {item.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>}

                        </div>

                        {isCandidateEdit && (
                          <section className="mt-8 border-t border-slate-200 pt-6">
                            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Candidate Details
                            </h3>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <Input label="Full Name" required name="candidateFullName" value={formData.candidateFullName} onChange={handleChange} />
                              <Input label="Email" required type="email" name="email" value={formData.email} onChange={handleChange} />
                              <Input label="Phone" required name="mobile" type="tel" inputMode="tel" autoComplete="tel" value={formData.mobile} onChange={handleChange} />
                              <Input label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} />
                              <Input label="Password (leave blank to keep current)" type="password" name="password" value={formData.password} onChange={handleChange} />
                              <Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                              <Input label="Current Location" name="currentLocation" value={formData.currentLocation} onChange={handleChange} />
                              <Input label="Country of Residence" name="country" value={formData.country} onChange={handleChange} />
                              <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                              <Input label="Current Role" name="currentRole" value={formData.currentRole} onChange={handleChange} />
                              <Input label="Preferred Role" name="preferredRole" value={formData.preferredRole} onChange={handleChange} />
                              <Input label="Years of Experience" type="number" min="0" max="50" name="yearsExperience" value={formData.yearsExperience} onChange={handleChange} />
                              <Select label="English Level" name="englishLevel" value={formData.englishLevel} onChange={handleChange}>{["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => <option key={level}>{level}</option>)}</Select>
                              <Select label="Visa Status" name="visaStatus" value={formData.visaStatus} onChange={handleChange}>{[["eu_citizen", "EU Citizen"], ["work_permit", "Work Permit"], ["blue_card", "EU Blue Card"], ["requires_sponsorship", "Requires Sponsorship"], ["student_visa", "Student Visa"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
                              <Input label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} />
                              <Input label="Expected Salary / Rate" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} />
                              <Input label="Availability" name="availability" value={formData.availability} onChange={handleChange} />
                              <Input label="Top Skills (comma separated)" name="skills" value={formData.skills} onChange={handleChange} />
                              <Input label="Interested Skills (comma separated)" name="interestedSkills" value={formData.interestedSkills} onChange={handleChange} />
                              <Input label="Languages Known (comma separated)" name="languagesKnown" value={formData.languagesKnown} onChange={handleChange} />
                              <Input label="Career Preference (comma separated)" name="careerPreference" value={formData.careerPreference} onChange={handleChange} />
                              <Input label="Preferred Work Mode (comma separated)" name="preferredWorkMode" value={formData.preferredWorkMode} onChange={handleChange} />
                              <label className="flex items-center gap-3 pt-7 text-sm font-medium text-slate-700"><input type="checkbox" name="euWorkEligible" checked={formData.euWorkEligible} onChange={handleChange} />EU Work Eligible</label>
                            </div>
                            <div className="mt-5">
                              <label className="mb-2 block text-sm font-medium text-slate-700">Candidate Resume</label>
                              <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setCandidateResume(event.target.files?.[0] || null)} className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm" />
                              <p className="mt-1 text-xs text-slate-500">{candidateResume ? candidateResume.name : "Upload a replacement CV only if needed (PDF, DOC, DOCX; maximum 5MB)."}</p>
                              {initialData?.candidate?.id && (initialData.candidate.cvFileName || initialData.candidate.cv) && (
                                <a className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline" href={downloadCvUrl}>
                                  Download existing resume{initialData.candidate.cvFileName ? ` (${initialData.candidate.cvFileName})` : ""}
                                </a>
                              )}
                            </div>
                          </section>
                        )}

                    </div>
                </div>

                {/* Footer */}
                <div
                    className="
            flex
            justify-end
            gap-3
            border-t
            border-slate-200
            px-8
            py-5
          "
                >
                    <button
                        onClick={onClose}
                        className="
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              font-medium
              text-slate-700
              hover:bg-slate-50
            "
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className={`
              rounded-xl
              ${theme.button}
              px-5
              py-3
              font-medium
              text-white
            `}
                    >
  {mode === "edit" ? "Update User" : "Create User"}

                    </button>
                </div>
            </div>
        </div>
    );
}
