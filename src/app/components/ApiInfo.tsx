"use client";

export default function ApiInfo() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return <p>API Base URL: {apiUrl}</p>;
}
