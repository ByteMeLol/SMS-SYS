"use client";

import {
  BadgeCheck,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";

export type DashboardSection = "students" | "admissions" | "enrollment";

const navigation: {
  id: DashboardSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "students", label: "Student records", icon: UsersRound },
  { id: "admissions", label: "New admission", icon: UserRoundPlus },
  { id: "enrollment", label: "Enrollment status", icon: BadgeCheck },
];

export default function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: DashboardSection;
  onSelect: (section: DashboardSection) => void;
}) {
  return (
    <aside className="flex w-full flex-col border-b border-[#d8e1df] bg-white p-4 md:min-h-screen md:w-64 md:border-r md:border-b-0 md:p-6">
      <Link href="/" className="mb-5 flex items-center gap-3 px-2 md:mb-10">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#172220] text-white">
          <GraduationCap className="size-5" aria-hidden="true" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-[#172220]">
          SMS-SYS
        </span>
      </Link>

      <div className="mb-3 hidden px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#9aa6a2] md:block">
        School management
      </div>
      <nav
        aria-label="School management"
        className="flex gap-2 overflow-x-auto md:flex-col"
      >
        {navigation.map(({ id, label, icon: Icon }) => {
          const active = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onSelect(id)}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                active
                  ? "bg-[#fff0f1] text-[#d92f45]"
                  : "text-[#66736f] hover:bg-[#f4f7f6] hover:text-[#172220]"
              }`}
            >
              <Icon className="size-[18px]" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto hidden rounded-2xl bg-[#f4f7f6] p-4 md:block">
        <div className="flex items-center gap-2 text-sm font-bold text-[#172220]">
          <LayoutDashboard
            className="size-4 text-[#d92f45]"
            aria-hidden="true"
          />
          Administrator
        </div>
        <p className="mt-2 text-xs leading-5 text-[#66736f]">
          Manage admissions and student enrollment records.
        </p>
      </div>
    </aside>
  );
}