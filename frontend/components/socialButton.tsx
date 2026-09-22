import { ReactNode } from "react";

export default function SocialButton(
    { children, label }:
    { children: ReactNode;
        label: string;
    }
) {
  return (
    <button type="button" aria-label={label} className="flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-white">
      {children}
    </button>
  );
}