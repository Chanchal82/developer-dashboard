
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 text-2xl font-bold">Create an Account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="rounded border p-3"
        />

        <input
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="rounded border p-3"
        />

        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password (at least 8 characters)"
          className="rounded border p-3"
        />

        {error && <p role="alert" className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-5 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </main>
  );
}
