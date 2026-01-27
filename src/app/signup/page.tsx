"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Signup submitted (backend will be connected later)");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
      }}
    >
      <form
        onSubmit={handleSignup}
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px", color: "#e11d48" }}>
          Sign Up
        </h1>

        <p style={{ marginBottom: "24px", color: "#6b7280" }}>
          Create your RaktSetu account
        </p>

        {/* Name */}
        <label>Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* Password */}
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={primaryButton}>
          Create Account
        </button>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#e11d48" }}>
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  marginBottom: "16px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
};

const primaryButton = {
  width: "100%",
  backgroundColor: "#e11d48",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
