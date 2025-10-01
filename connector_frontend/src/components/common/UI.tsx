"use client";
import React from "react";
import clsx from "clsx";

export const colors = {
  primary: "#2563EB",
  secondary: "#F59E0B",
  background: "#f9fafb",
  surface: "#ffffff",
  text: "#111827",
  error: "#EF4444",
  success: "#10B981",
};

type CardProps = React.PropsWithChildren<{
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}>;

export function Card({ className, title, subtitle, footer, children }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl shadow-sm border border-gray-200 bg-white",
        "transition hover:shadow-md",
        className
      )}
      style={{ background: colors.surface }}
    >
      {(title || subtitle) && (
        <div className="px-5 pt-5">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={clsx((title || subtitle) ? "p-5 pt-4" : "p-5")}>{children}</div>
      {footer && <div className="px-5 pb-5">{footer}</div>}
    </div>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};
export function Button({ className, children, variant = "primary", loading, ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<string, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    secondary:
      "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 disabled:bg-amber-300",
    ghost:
      "bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-500 disabled:text-blue-300",
  };
  return (
    <button className={clsx(base, variants[variant], className)} disabled={loading || rest.disabled} {...rest}>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };
export function Input({ className, label, error, ...rest }: InputProps) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <input
        className={clsx(
          "block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
          className
        )}
        {...rest}
      />
      {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}

type StatusBannerProps = {
  type: "success" | "error" | "info";
  title: string;
  message?: string;
  onClose?: () => void;
};
export function StatusBanner({ type, title, message, onClose }: StatusBannerProps) {
  const map = {
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
  } as const;
  const m = map[type];
  return (
    <div className={clsx("rounded-lg border p-3 flex items-start gap-3", m.bg, m.border, m.text)}>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">✕</button>
      )}
    </div>
  );
}
