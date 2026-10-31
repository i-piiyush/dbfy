import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <Suspense fallback={<div className="h-[420px] w-full max-w-md animate-pulse rounded-2xl bg-white shadow-sm" />}>
        <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
      </Suspense>
    </main>
  );
}
