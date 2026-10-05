"use client";

import {
  BadgeCheck,
  GraduationCap,
  Hash,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  UsersRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import Sidebar, { type DashboardSection } from "@/components/sidebar";
import { apiRequest, ApiError } from "@/lib/api";

const statuses = [
  "ACTIVE",
  "INACTIVE",
  "GRADUATED",
  "SUSPENDED",
  "TRANSFERRED",
] as const;
type StudentStatus = (typeof statuses)[number];
type StatusFilter = "ALL" | StudentStatus;

type Student = {
  id: number;
  admissionNumber: string;
  dateOfBirth: string | null;
  address: string | null;
  admissionDate: string | null;
  status: StudentStatus;
};

const statusLabel = (status: StudentStatus) =>
  status.charAt(0) + status.slice(1).toLowerCase();

function formatDate(date: string | null) {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(parsed);
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    return "Your session has expired. Please sign in again.";
  }
  if (error instanceof ApiError && error.status === 403) {
    return "Your account does not have permission to view or update student records.";
  }
  return error instanceof Error ? error.message : "The request could not be completed.";
}

async function fetchStudents() {
  const result = await apiRequest<Student[]>("/v1/students/show");
  if (!Array.isArray(result)) {
    throw new Error("The school service returned an unexpected student list.");
  }
  return result;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<DashboardSection>("students");
  const [students, setStudents] = useState<Student[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admissionError, setAdmissionError] = useState("");
  const [savingAdmission, setSavingAdmission] = useState(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);

  useEffect(() => {
    if (!window.sessionStorage.getItem("sms-sys-token")) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    fetchStudents()
      .then((result) => {
        if (cancelled) return;
        setError("");
        setStudents(result);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          window.sessionStorage.removeItem("sms-sys-token");
          router.replace("/login");
          return;
        }
        setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "ALL" || student.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          student.admissionNumber,
          student.id.toString(),
          student.address ?? "",
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, students]);

  const recentAdmissions = useMemo(
    () =>
      [...students]
        .filter((student) => student.admissionDate)
        .sort((first, second) =>
          (second.admissionDate ?? "").localeCompare(first.admissionDate ?? ""),
        )
        .slice(0, 5),
    [students],
  );

  const changeStatus = async (student: Student, nextStatus: StudentStatus) => {
    if (student.status === nextStatus) return;
    setUpdatingStudentId(student.id);
    setError("");
    setSuccess("");
    try {
      const updated = await apiRequest<Student>(
        `/v1/students/${student.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      setStudents((current) =>
        current.map((entry) => (entry.id === updated.id ? updated : entry)),
      );
      setSuccess(`Enrollment status updated to ${statusLabel(updated.status)}.`);
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const createAdmission = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setAdmissionError("");
    setError("");
    setSuccess("");
    setSavingAdmission(true);
    const formData = new FormData(form);
    const request = {
      email: String(formData.get("email") ?? ""),
      firstName: String(formData.get("firstName") ?? ""),
      middleName: String(formData.get("middleName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
      gender: String(formData.get("gender") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      admissionDate: String(formData.get("admissionDate") ?? ""),
    };

    try {
      const created = await apiRequest<Student>("/v1/register/student", {
        method: "POST",
        body: JSON.stringify(request),
      });
      setStudents((current) => [...current, created]);
      form.reset();
      setSuccess(
        `Admission created successfully. Admission number: ${created.admissionNumber}.`,
      );
      setActiveSection("students");
    } catch (createError) {
      setAdmissionError(getErrorMessage(createError));
    } finally {
      setSavingAdmission(false);
    }
  };

  const refreshStudents = async () => {
    setError("");
    setRefreshing(true);
    try {
      setStudents(await fetchStudents());
    } catch (refreshError) {
      if (refreshError instanceof ApiError && refreshError.status === 401) {
        window.sessionStorage.removeItem("sms-sys-token");
        router.replace("/login");
        return;
      }
      setError(getErrorMessage(refreshError));
    } finally {
      setRefreshing(false);
    }
  };

  const signOut = () => {
    window.sessionStorage.removeItem("sms-sys-token");
    router.replace("/login");
  };

  if (loading && students.length === 0 && !error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2f1]">
        <LoaderCircle className="size-7 animate-spin text-[#d92f45]" aria-label="Loading dashboard" />
      </main>
    );
  }

  const totalCount = students.length;
  const countForStatus = (status: StudentStatus) =>
    students.filter((student) => student.status === status).length;

  return (
    <main className="min-h-screen bg-[#eef2f1] md:flex">
      <Sidebar
        activeSection={activeSection}
        onSelect={(section) => {
          setActiveSection(section);
          setSuccess("");
          setAdmissionError("");
        }}
      />
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#66736f]">
                School management
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#172220] sm:text-3xl">
                {activeSection === "students"
                  ? "Student records"
                  : activeSection === "admissions"
                    ? "New admission"
                    : "Enrollment status"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={refreshStudents}
                disabled={loading || refreshing}
                className="flex items-center gap-2 rounded-xl border border-[#d8e1df] bg-white px-4 py-2.5 text-sm font-semibold text-[#394642] transition hover:bg-[#f4f7f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`size-4 ${refreshing ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                type="button"
                onClick={signOut}
                className="rounded-xl bg-[#172220] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263632]"
              >
                Sign out
              </button>
            </div>
          </header>

          <section className="dashboard-masthead mb-6 rounded-[24px] px-6 py-7 text-white sm:px-9 sm:py-8">
            <div className="dashboard-masthead-cross" aria-hidden="true" />
            <div className="relative z-10 max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                STUDENT ADMINISTRATION
              </p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Keep every student record in view.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/85">
                Review admissions and manage enrollment statuses from one
                place.
              </p>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f2b9c0] bg-[#fff0f1] px-4 py-3 text-sm text-[#922235]"
            >
              <span>{error}</span>
              {error.includes("session has expired") && (
                <button
                  type="button"
                  onClick={() => router.replace("/login")}
                  className="font-bold underline underline-offset-2"
                >
                  Sign in again
                </button>
              )}
            </div>
          )}
          {success && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-[#afe7ce] bg-[#e8f8f1] px-4 py-3 text-sm font-semibold text-[#126443]"
            >
              {success}
            </p>
          )}

          {activeSection === "admissions" ? (
            <section className="rounded-2xl border border-[#dce4e2] bg-white p-5 shadow-[0_8px_24px_rgba(23,34,32,0.04)] sm:p-8">
              <div className="mb-6 flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0f1] text-[#d92f45]">
                  <Plus className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-extrabold text-[#172220]">
                    Register a student
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#66736f]">
                    Submitting creates the student profile and generates an
                    admission number.
                  </p>
                </div>
              </div>

              {admissionError && (
                <p
                  role="alert"
                  className="mb-5 rounded-xl border border-[#f2b9c0] bg-[#fff0f1] px-4 py-3 text-sm text-[#922235]"
                >
                  {admissionError}
                </p>
              )}

              <form
                className="grid gap-x-5 gap-y-4 sm:grid-cols-2"
                onSubmit={createAdmission}
              >
                {[
                  ["firstName", "First name", "text"],
                  ["middleName", "Middle name", "text"],
                  ["lastName", "Last name", "text"],
                  ["email", "Email address", "email"],
                  ["phone", "Phone number", "tel"],
                  ["gender", "Gender", "text"],
                  ["dateOfBirth", "Date of birth", "date"],
                  ["admissionDate", "Admission date", "date"],
                ].map(([name, label, type]) => (
                  <label
                    key={name}
                    htmlFor={`admission-${name}`}
                    className="space-y-2 text-sm font-semibold text-[#394642]"
                  >
                    <span>{label}</span>
                    <input
                      id={`admission-${name}`}
                      name={name}
                      type={type}
                      required
                      autoComplete={
                        name === "firstName"
                          ? "given-name"
                          : name === "middleName"
                            ? "additional-name"
                            : name === "lastName"
                              ? "family-name"
                              : name === "email"
                                ? "email"
                                : name === "phone"
                                  ? "tel"
                                  : undefined
                      }
                      className="h-12 w-full rounded-xl border border-[#dce4e2] bg-white px-4 text-sm font-normal text-[#172220] outline-none transition focus:border-[#ff5364] focus:ring-4 focus:ring-[#ff5364]/10"
                    />
                  </label>
                ))}
                <label
                  htmlFor="admission-address"
                  className="space-y-2 text-sm font-semibold text-[#394642] sm:col-span-2"
                >
                  <span>Address</span>
                  <textarea
                    id="admission-address"
                    name="address"
                    required
                    rows={3}
                    className="w-full rounded-xl border border-[#dce4e2] bg-white px-4 py-3 text-sm font-normal text-[#172220] outline-none transition focus:border-[#ff5364] focus:ring-4 focus:ring-[#ff5364]/10"
                  />
                </label>
                <button
                  type="submit"
                  disabled={savingAdmission}
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-[#d92f45] px-5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(217,47,69,0.2)] transition hover:bg-[#c5263b] disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-end"
                >
                  {savingAdmission && (
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  )}
                  {savingAdmission ? "Creating admission..." : "Create admission"}
                </button>
              </form>
            </section>
          ) : (
            <>
              <section
                aria-label="Student totals"
                className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
              >
                <SummaryCard
                  label="All students"
                  count={totalCount}
                  icon={UsersRound}
                  active={statusFilter === "ALL"}
                  onClick={() => setStatusFilter("ALL")}
                />
                {statuses.map((status) => (
                  <SummaryCard
                    key={status}
                    label={statusLabel(status)}
                    count={countForStatus(status)}
                    icon={status === "ACTIVE" ? GraduationCap : BadgeCheck}
                    active={statusFilter === status}
                    onClick={() => setStatusFilter(status)}
                  />
                ))}
              </section>

              {activeSection === "students" && (
                <section className="mb-6 rounded-2xl border border-[#dce4e2] bg-white p-5 shadow-[0_8px_24px_rgba(23,34,32,0.04)] sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#167a55]">
                        Recent admissions
                      </p>
                      <h2 className="mt-1 text-lg font-extrabold text-[#172220]">
                        Latest by admission date
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection("admissions")}
                      className="flex items-center gap-2 rounded-lg bg-[#fff0f1] px-3 py-2 text-sm font-bold text-[#d92f45] transition hover:bg-[#ffe2e5]"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      New admission
                    </button>
                  </div>
                  {recentAdmissions.length === 0 ? (
                    <p className="rounded-xl bg-[#f4f7f6] px-4 py-5 text-sm text-[#66736f]">
                      {loading
                        ? "Loading admission records..."
                        : "No admission records are available yet."}
                    </p>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {recentAdmissions.map((student) => (
                        <article
                          key={student.id}
                          className="rounded-xl border border-[#dce4e2] p-4"
                        >
                          <div className="flex items-center gap-2 text-sm font-bold text-[#172220]">
                            <Hash className="size-4 text-[#d92f45]" aria-hidden="true" />
                            {student.admissionNumber}
                          </div>
                          <p className="mt-2 text-xs text-[#66736f]">
                            Admitted {formatDate(student.admissionDate)}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section className="overflow-hidden rounded-2xl border border-[#dce4e2] bg-white shadow-[0_8px_24px_rgba(23,34,32,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce4e2] p-5 sm:p-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#172220]">
                      {activeSection === "enrollment"
                        ? "Enrollment status"
                        : "All student records"}
                    </h2>
                    <p className="mt-1 text-sm text-[#66736f]">
                      {filteredStudents.length}{" "}
                      {filteredStudents.length === 1 ? "record" : "records"}
                    </p>
                  </div>
                  <label className="relative block w-full sm:max-w-xs">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9aa6a2]"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search admission no., ID, address"
                      aria-label="Search student records"
                      className="h-11 w-full rounded-xl border border-[#dce4e2] bg-white pl-9 pr-3 text-sm text-[#172220] outline-none placeholder:text-[#9aa6a2] focus:border-[#ff5364] focus:ring-4 focus:ring-[#ff5364]/10"
                    />
                  </label>
                </div>
                <div className="flex gap-2 overflow-x-auto border-b border-[#dce4e2] px-5 py-3 sm:px-6">
                  <StatusTab
                    label="All"
                    count={totalCount}
                    active={statusFilter === "ALL"}
                    onClick={() => setStatusFilter("ALL")}
                  />
                  {statuses.map((status) => (
                    <StatusTab
                      key={status}
                      label={statusLabel(status)}
                      count={countForStatus(status)}
                      active={statusFilter === status}
                      onClick={() => setStatusFilter(status)}
                    />
                  ))}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center gap-3 px-5 py-14 text-sm font-semibold text-[#66736f]">
                    <LoaderCircle className="size-5 animate-spin text-[#d92f45]" aria-hidden="true" />
                    Loading student records...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    <UsersRound className="mx-auto size-8 text-[#9aa6a2]" aria-hidden="true" />
                    <p className="mt-3 text-sm font-bold text-[#172220]">
                      No student records found
                    </p>
                    <p className="mt-1 text-sm text-[#66736f]">
                      {error
                        ? "Student records could not be loaded."
                        : "Try another filter or add a new admission."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="bg-[#f4f7f6] text-xs uppercase tracking-wide text-[#66736f]">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-bold sm:px-6">
                            Student
                          </th>
                          <th scope="col" className="px-5 py-3 font-bold">
                            Date of birth
                          </th>
                          <th scope="col" className="px-5 py-3 font-bold">
                            Address
                          </th>
                          <th scope="col" className="px-5 py-3 font-bold">
                            Admission date
                          </th>
                          <th scope="col" className="px-5 py-3 font-bold">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#edf1f0]">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="align-middle">
                            <td className="px-5 py-4 sm:px-6">
                              <p className="font-bold text-[#172220]">
                                {student.admissionNumber}
                              </p>
                              <p className="mt-1 text-xs text-[#66736f]">
                                Student ID {student.id}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-[#394642]">
                              {formatDate(student.dateOfBirth)}
                            </td>
                            <td className="max-w-56 truncate px-5 py-4 text-[#394642]">
                              {student.address || "—"}
                            </td>
                            <td className="px-5 py-4 text-[#394642]">
                              {formatDate(student.admissionDate)}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <StatusPill status={student.status} />
                                <label className="sr-only" htmlFor={`status-${student.id}`}>
                                  Update status for {student.admissionNumber}
                                </label>
                                <select
                                  id={`status-${student.id}`}
                                  value={student.status}
                                  disabled={updatingStudentId === student.id}
                                  onChange={(event) =>
                                    void changeStatus(
                                      student,
                                      event.target.value as StudentStatus,
                                    )
                                  }
                                  className="max-w-32 rounded-lg border border-[#dce4e2] bg-white px-2 py-1.5 text-xs text-[#394642] outline-none focus:border-[#ff5364] disabled:opacity-60"
                                >
                                  {statuses.map((status) => (
                                    <option key={status} value={status}>
                                      {statusLabel(status)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="border-t border-[#dce4e2] px-5 py-3 text-xs text-[#66736f] sm:px-6">
                      Student names and contact details aren&apos;t included in
                      the current student-list API response.
                    </p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  count,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  icon: typeof UsersRound;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[#f2aab3] bg-[#fff0f1] shadow-[0_4px_16px_rgba(217,47,69,0.08)]"
          : "border-[#dce4e2] bg-white hover:border-[#c5d2ce]"
      }`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#66736f]">{label}</span>
        <Icon
          className={`size-4 ${active ? "text-[#d92f45]" : "text-[#9aa6a2]"}`}
          aria-hidden="true"
        />
      </span>
      <span className="mt-2 block text-2xl font-extrabold text-[#172220]">
        {count}
      </span>
    </button>
  );
}

function StatusTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
        active
          ? "bg-[#fff0f1] text-[#d92f45]"
          : "text-[#66736f] hover:bg-[#f4f7f6]"
      }`}
    >
      {label}
      <span className={active ? "text-[#d92f45]/70" : "text-[#9aa6a2]"}>
        {count}
      </span>
    </button>
  );
}

function StatusPill({ status }: { status: StudentStatus }) {
  const colors: Record<StudentStatus, string> = {
    ACTIVE: "bg-[#e8f8f1] text-[#167a55]",
    INACTIVE: "bg-[#f4f7f6] text-[#66736f]",
    GRADUATED: "bg-[#eef2ff] text-[#555fc7]",
    SUSPENDED: "bg-[#fff0f1] text-[#d92f45]",
    TRANSFERRED: "bg-[#fff5e8] text-[#9a5c08]",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
