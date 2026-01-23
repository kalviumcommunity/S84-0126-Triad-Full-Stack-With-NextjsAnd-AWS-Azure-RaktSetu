"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Login failed");
        setLoading(false);
        return;
      }

      // store token (mock) and redirect
      Cookies.set("token", data.token, { expires: 1 });
      router.push("/dashboard");
    } catch (err) {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 28,
          border: "1px solid #eee",
          borderRadius: 8,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          background: "#fff",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 12, color: "#e11d48" }}>Login</h1>

        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginTop: 6,
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
            required
          />
        </label>

        <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginTop: 6,
              marginBottom: 12,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
            required
            minLength={6}
          />
        </label>

        {error && (
          <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 14px",
            backgroundColor: "#e11d48",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "default" : "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
