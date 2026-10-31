import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <Suspense fallback={<div className="h-[420px] w-full max-w-md animate-pulse rounded-2xl bg-white shadow-sm" />}>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </Suspense>
    </main>
  );
}
