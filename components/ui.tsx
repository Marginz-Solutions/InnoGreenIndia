import Link from "next/link";
import { ReactNode } from "react";

// Container
export function Container({ children }: { children: ReactNode }) {
  return <div className="max-w-[1380px] mx-auto p-6">{children}</div>;
}

// Panel
export function Panel({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-md ${
        dark
          ? "bg-gradient-to-br from-[#0b1d10] to-[#184422] text-white border-none relative overflow-hidden"
          : "bg-gradient-to-b from-white to-[#f8fcf8] border border-[#e2ece3]"
      } ${className}`}
    >
      {children}
      {dark && (
        <span className="absolute right-4 -bottom-2 text-8xl font-black text-white/5 pointer-events-none">
          IGIM
        </span>
      )}
    </div>
  );
}

// Card
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-[#e2ece3] rounded-2xl p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

// KPI Card
export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-[#e2ece3] rounded-2xl p-5 shadow-sm">
      <div className="text-[#64748b] text-sm mb-2">{label}</div>
      <div className="text-3xl font-extrabold text-[#10361c]">{value}</div>
    </div>
  );
}

// Button
export function Button({
  children,
  href,
  variant = "default",
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: "default" | "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 py-3 px-3.5 rounded-xl font-bold cursor-pointer transition-colors";
  const variantClasses = {
    default: "bg-white border border-[#dbe8dc] text-[#102018] hover:bg-[#f0f7f0]",
    primary:
      "bg-gradient-to-r from-[#1f7a36] to-[#2f9b43] text-white border-[#1f7a36]",
    secondary: "bg-[#fef8e7] border border-[#e6d39d] text-[#7c5a06]",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

// Badge
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block py-1.5 px-2.5 rounded-full bg-[#edf8ee] text-[#166534] text-xs font-bold">
      {children}
    </span>
  );
}

// Tag
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs py-1.5 px-2 rounded-full bg-[#edf8ee] text-[#166534] font-semibold">
      {children}
    </span>
  );
}

// Sheet Card
export function SheetCard({
  title,
  description,
  rows,
  columns,
  href,
}: {
  title: string;
  description: string;
  rows?: number;
  columns?: number;
  href: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-b from-white to-[#f8fcf8] border border-[#e2ece3]">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#61756a] text-sm">{description}</p>
      {(rows || columns) && (
        <div className="flex gap-2 flex-wrap mt-3">
          {rows && <Tag>Rows: {rows}</Tag>}
          {columns && <Tag>Columns: {columns}</Tag>}
        </div>
      )}
      <div className="mt-3.5">
        <Button href={href} variant="primary">
          View sheet
        </Button>
      </div>
    </div>
  );
}

// Table wrapper
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-auto border border-[#e2ece3] rounded-xl bg-white">
      {children}
    </div>
  );
}

// Search bar
export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="py-3 px-3.5 border border-[#cfe0d2] rounded-xl min-w-[220px] bg-white w-full max-w-md"
    />
  );
}

// List item
export function ListItem({
  title,
  children,
  badge,
}: {
  title: string;
  children: ReactNode;
  badge?: string;
}) {
  return (
    <div className="p-3.5 border border-[#e2ece3] rounded-xl bg-white">
      <strong>{title}</strong>
      {badge && (
        <div className="mt-2">
          <Badge>{badge}</Badge>
        </div>
      )}
      <div className="text-[#61756a] mt-2 text-sm">{children}</div>
    </div>
  );
}
