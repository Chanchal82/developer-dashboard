
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "@/app/components/LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/dashboard" className="text-xl font-bold">
        Developer Dashboard
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              {user.email}
            </span>

            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>

            <Link href="/projects" className="hover:underline">
              Projects
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>

            <Link
              href="/register"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
