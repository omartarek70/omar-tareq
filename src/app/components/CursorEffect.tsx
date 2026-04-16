"use client";
import { useState, useEffect } from "react";

export default function CursorEffect() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed h-2.5 w-2.5 rounded-full bg-primary-700 z-50 transition-transform duration-100"
        style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
      />
      <div
        className="pointer-events-none fixed h-8 w-8 rounded-full border-2 border-primary-700/40 z-50"
        style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
      />
    </>
  );
}
