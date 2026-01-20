import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        RaktSetu
      </h1>

      <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-md">
        A Next.js App Router project demonstrating public routes, protected
        routes, and dynamic routing.
      </p>

      <div className="flex gap-4 mt-4">
        <Link href="/login" className="rounded bg-red-600 px-4 py-2 text-white">
          Login
        </Link>

        <Link
          href="/dashboard"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Dashboard
        </Link>

        <Link href="/users/1" className="rounded border px-4 py-2">
          User 1
        </Link>
      </div>
    </main>
  );
}
