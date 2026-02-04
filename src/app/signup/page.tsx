"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setMessage(data?.message ?? "Signup failed");
        return;
      }

      setMessage("Signup successful. You can now log in.");
      router.push("/login");
    } catch {
      setMessage("Something went wrong while signing up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Join Raktsetu
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create an account to start saving lives
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-1 px-4 py-3 border rounded-lg text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-3 border rounded-lg text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 border rounded-lg text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center text-red-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Account..." : "Create Account \u2192"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red-600 font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </AuthLayout>
  );
}
