"use client";
import Link from "next/link";
import Image from "next/image";
import { useUIContext } from "@/context/UIContext";

export default function Navbar() {
  const { theme, toggleTheme } = useUIContext();

  return (
    <header
      style={{
        width: "100%",
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "#dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <Image
            src="/blood-donate.png"
            alt="Logo"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
        <span style={{ fontWeight: 700, color: "#000000", fontSize: "20px" }}>
          Raktsetu
        </span>
      </div>

      {/* Links */}
      <nav style={{ display: "flex", gap: "24px" }}>
        <Link href="#how-it-works" className="nav-link">
          How It Works
        </Link>
        <Link href="#features" className="nav-link">
          Features
        </Link>
        <Link href="#roles" className="nav-link">
          For Hospitals
        </Link>
        <Link href="#roles" className="nav-link">
          For NGOs
        </Link>
      </nav>

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: theme === "light" ? "#fbbf24" : "#374151",
            border: "2px solid #d1d5db",
            borderRadius: "999px",
            padding: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: "70px",
            height: "36px",
            position: "relative",
          }}
          title="Toggle Dark Mode"
        >
          {/* Light Mode Icon (Bulb) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: theme === "light" ? "white" : "transparent",
              transition: "all 0.3s ease",
              fontSize: "16px",
            }}
          >
            💡
          </div>

          {/* Dark Mode Icon (Moon) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: theme === "dark" ? "#1f2937" : "transparent",
              transition: "all 0.3s ease",
              fontSize: "16px",
            }}
          >
            🌙
          </div>
        </button>

        <Link href="/signup" style={{ color: "#000000" }}>
          Sign In
        </Link>
        <button
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "10px 18px",
            borderRadius: "999px",
            border: "none",
            fontWeight: 600,
          }}
        >
          <Link href="/login">Donate Now</Link>
        </button>
      </div>
    </header>
  );
}
