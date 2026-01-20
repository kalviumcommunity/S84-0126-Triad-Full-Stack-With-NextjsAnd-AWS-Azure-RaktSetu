import Link from "next/link";

export default function Users() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Users List</h1>

      <ul>
        <li>
          <Link href="/users/1">User 1</Link>
        </li>
        <li>
          <Link href="/users/2">User 2</Link>
        </li>
        <li>
          <Link href="/users/3">User 3</Link>
        </li>
      </ul>
    </main>
  );
}
