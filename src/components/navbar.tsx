import Link from "next/link";

export default function Navbar() {
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
          🩸
        </div>
        <span style={{ fontWeight: 700, color: "#000000", fontSize: "18px" }}>
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
          Donate Now
        </button>
      </div>
    </header>
  );
}
