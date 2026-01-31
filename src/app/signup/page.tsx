import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-2 text-black">
          Join Raktsetu
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create an account to start saving lives
        </p>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-black">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full mt-1 px-4 py-3 border rounded-lg text-black
                        placeholder-gray-300
                        focus:outline-none focus:ring-2 focus:ring-red-500"
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
            />
          </div>

          <div>
            <label className="text-sm font-medium text-black">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 border rounded-lg text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Create Account →
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
