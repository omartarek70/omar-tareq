import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export default function Section({
  children,
  className = "",
  title,
  subtitle,
}: SectionProps) {
  return (
    <section className={`section ${className}`}>
      {(title || subtitle) && (
        <div className="mb-12">
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && (
            <p className="mt-3 text-lg text-slate-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
