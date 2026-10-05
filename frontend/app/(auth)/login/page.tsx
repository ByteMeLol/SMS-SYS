"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const token = await apiRequest<string>("/auth/login", {
        method: "POST",
        authenticated: false,
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });
      if (typeof token !== "string" || !token.trim()) {
        throw new Error("The school service did not return a sign-in token.");
      }
      window.sessionStorage.setItem("sms-sys-token", token.trim());
      router.replace("/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Sign-in failed. Check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2f1] md:p-6 lg:p-10">
      <div className="mx-auto grid min-h-screen max-w-6xl overflow-hidden bg-white shadow-[0_24px_80px_rgba(23,34,32,0.1)] md:min-h-[min(850px,calc(100vh-3rem))] md:grid-cols-[0.9fr_1.1fr] md:rounded-[28px] lg:min-h-[min(850px,calc(100vh-5rem))]">
        <section className="auth-visual flex min-h-[230px] flex-col justify-between p-7 text-white sm:p-10 md:min-h-full md:p-12">
          <div className="relative z-10 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Zap className="size-5 fill-[#ff5364] text-[#ff5364]" />
            </span>
            <span className="text-lg font-extrabold tracking-tight">SMS-SYS</span>
          </div>
          <div className="relative z-10 mt-10 max-w-md">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#ff9da7]">
              School management, made simple
            </p>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              A better day at school starts here.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              Bring your school community, learning, and everyday operations
              together in one welcoming place.
            </p>
          </div>
          <p className="relative z-10 mt-8 text-xs text-white/45">
            Your school, all in one place.
          </p>
        </section>

        <section className="auth-form-panel flex items-center justify-center px-6 py-10 sm:px-10 md:px-12 lg:px-16">
          <span className="auth-coral-slash" aria-hidden="true" />
          <div className="relative z-10 mx-auto w-full max-w-md">
          <h1 className="mb-3 text-center text-3xl font-extrabold tracking-tight text-[#172220] sm:text-4xl">
            Welcome back
          </h1>
          <p className="mb-9 text-center text-sm text-[#66736f]">
            Sign in with your school account to continue.
          </p>

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl border border-[#f2b9c0] bg-[#fff0f1] px-4 py-3 text-sm text-[#922235]"
            >
              {error}
            </p>
          )}

          <form className="space-y-5" onSubmit={submitLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#394642]">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Enter your email address"
                className="h-12 w-full rounded-xl border border-[#dce4e2] bg-white px-4 text-sm text-[#172220] outline-none placeholder:text-[#9aa6a2] transition focus:border-[#ff5364] focus:ring-4 focus:ring-[#ff5364]/10"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#394642]">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-[#dce4e2] bg-white px-4 text-sm text-[#172220] outline-none placeholder:text-[#9aa6a2] transition focus:border-[#ff5364] focus:ring-4 focus:ring-[#ff5364]/10"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-[#d92f45] text-sm font-bold tracking-[0.12em] text-white shadow-[0_8px_18px_rgba(217,47,69,0.2)] transition hover:bg-[#c5263b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92f45]"
            >
              {submitting ? "SIGNING IN..." : "LOG IN"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#66736f]">
            Doesn&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-[#d92f45] hover:underline">
              Signup
            </Link>
          </p>

          </div>
        </section>
      </div>
    </main>
  );
}