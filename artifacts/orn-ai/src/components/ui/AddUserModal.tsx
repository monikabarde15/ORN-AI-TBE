"use client";

import React, { useState } from "react";

import { Toaster, toast } from "react-hot-toast";
import api from "../../../services/api";

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



export default function AddUserModal({
    open,
    onClose,
    onSubmit,
}: AddUserModalProps) {
    const [generatedPassword, setGeneratedPassword] = useState("");
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

        role: "Student",
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
    });

    if (!open) return null;

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

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
            Math.random().toString(36).slice(-10) + "A1!";

        setGeneratedPassword(password);

        setFormData((prev) => ({
            ...prev,
            password,
            confirmPassword: password,
        }));
    };

const handleSubmit = async () => {
  try {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
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

    const role = roleMap[formData.role] ?? "candidate";

    const payload: any = {
      email: formData.email,
      password: formData.password,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),

      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,

      mobile: formData.mobile,
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

      role,
      gdprConsent: true,
        createdByAdmin: true,
    };

    // Candidate/Student only
    if (role === "candidate") {
      payload.candidateProfile = {
        fullName: payload.fullName,
        email: formData.email,
        phone: formData.mobile,
        country: formData.country,

        targetRole: formData.designation || "Student",

        yearsExperience: 0,

        visaStatus: "requires_sponsorship",

        englishLevel: "B1",

        euWorkEligible: false,

        linkedinUrl: "",

        skills: [],
      };
    }

    const { data } = await api.post("/api/auth/register", payload);

    // Generate evaluation only for Student/Candidate
    if (role === "candidate" && data?.user?.candidateId) {
      await api.post(
        `/api/candidates/${data.user.candidateId}/evaluation`
      );
    }

    toast.success("User created successfully");

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
          max-h-[92vh]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
            >
                {/* Header */}
                <div
                    className="
            flex
            items-start
            justify-between
            border-b
            border-slate-200
            px-8
            py-6
          "
                >
                    <div>
                        <div className="flex items-center gap-3">
                            <div
                                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-100
                "
                            >
                                <UserPlus
                                    size={22}
                                    className="text-indigo-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Add New User
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create a user account and assign a
                                    role.
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
                <div className="overflow-y-auto px-8 py-6">
                    <div className="space-y-10">

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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Mobile Number"
                                    required
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Employee / Student ID"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                />
                            </div>
                        </section>

                        {/* Account */}
                        <section>
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
                        <section>
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
                                >
                                    <option>Student</option>
                                    <option>Recruiter</option>
                                    <option>Instructor</option>
                                    <option>Mentor</option>
                                    <option>Content Manager</option>
                                    <option>Admin</option>
                                    <option>Super Admin</option>
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
                        <section>
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
                        <section>
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
                        <section>
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
                        </section>

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
                        className="
              rounded-xl
              bg-blue-900
              px-5
              py-3
              font-medium
              text-white
              hover:bg-blue-800
            "
                    >
                        Create User
                    </button>
                </div>
            </div>
        </div>
    );
}