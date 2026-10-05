import { ReactNode } from "react";

export default function SocialButton(
    { children, label }:
    { children: ReactNode;
        label: string;
    }
) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-xl border border-[#dce4e2] bg-white text-[#172220] transition hover:border-[#ff5364] hover:bg-[#fff6f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92f45]"
    >
      {children}
    </button>
  );
}