"use client";

import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import SocialButton from "@/components/socialButton";

export default function Register() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e8e8e8] p-4 sm:p-8">
      {/* register form container */}
      <div className="grid w-full max-w-lg grid-cols-1 items-center gap-8 rounded-[0.5rem] bg-white p-6 sm:p-10 lg:grid-cols-1 lg:gap-12 lg:p-12">
        {/* form container */}
        <div className="mx-auto w-full max-w-md">
          {/* logo container */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {/* TODO: Add logo here */}
            <span className="flex size-7 items-center justify-center rounded-full bg-black text-white">
              <Zap className="size-3.5 fill-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              SMS-SYS
            </span>
          </div>

          {/* title container */}
          <h1 className="mb-10 text-center text-4xl font-semibold tracking-tight">
            Create an account
          </h1>

          {/* form container */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-neutral-600">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-neutral-600">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-neutral-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm text-neutral-600"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="h-11 w-full rounded-full border border-neutral-200 px-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-full bg-black text-sm font-medium tracking-[0.25em] text-white"
            >
              SIGN UP
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-[#3b82f6] hover:underline">
              Login
            </Link>
          </p>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs tracking-widest text-neutral-400">OR</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="flex items-center justify-center gap-4">
            <SocialButton label="Google">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </SocialButton>
            <SocialButton label="Apple">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M16.365 1.43c0 1.14-.42 2.07-1.26 2.79-.9.78-1.95 1.23-3.12 1.14-.12-1.08.36-2.1 1.2-2.85.9-.81 2.04-1.32 3.18-1.38zm3.24 16.5c-.66 1.56-1.44 2.97-2.58 4.23-1.02 1.14-1.86 1.8-3.12 1.8-1.26 0-1.68-.66-3.18-.66-1.56 0-2.1.69-3.24.69-1.26 0-2.16-.72-3.18-1.95-2.16-2.61-3.78-7.38-2.4-11.91.72-2.25 2.22-3.72 4.02-3.72 1.26 0 2.28.84 3.12.84.78 0 2.04-.96 3.54-.81.6.03 2.28.24 3.36 1.83-3.06 1.68-2.58 6.06.66 7.26-.48 1.26-1.08 2.52-1.8 3.6.06 0 .12-.03.18-.03.9 0 1.86.69 2.88.69 1.08 0 1.86-.6 2.7-1.68.54-.72.96-1.5 1.32-2.28-.06.03-.12.06-.18.09z"
                />
              </svg>
            </SocialButton>
            <SocialButton label="Facebook">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                
                  fill="#1877F2"
                  d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.09 24 18.1 24 12.07z"
                />
              </svg>
            </SocialButton>
          </div>
        </div>
      </div>
    </main>
  );
}

/*
function SocialButton({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white"
    >
      {children}
    </button>
  );
}
*/
