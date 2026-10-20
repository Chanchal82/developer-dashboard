
"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-blue-600 p-2 text-white disabled:opacity-50"
    >
      {pending ? "Creating Project..." : "Submit Project"}
    </button>
  );
}
