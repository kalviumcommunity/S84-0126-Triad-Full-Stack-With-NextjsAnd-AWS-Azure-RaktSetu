"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const router = useRouter();

  function handleLogin() {
    Cookies.set("token", "mock.jwt.token");
    router.push("/dashboard");
  }

  return (
    <main>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
