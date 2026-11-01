import { ClerkFailed, ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/ui/themes";
import { Suspense } from "react";
import AuthPageShell, { AuthPageLoadError, AuthPageLoader } from "@/components/AuthPageShell";
import AuthPageReadyGate from "@/components/AuthPageReadyGate";

export default function SignUpPage() {
  return (
    <>
      <ClerkLoading><AuthPageLoader mode="sign-up" /></ClerkLoading>
      <ClerkLoaded>
        <AuthPageReadyGate mode="sign-up">
          <AuthPageShell mode="sign-up">
            <Suspense fallback={<AuthPageLoader mode="sign-up" />}>
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                appearance={{ theme: neobrutalism, variables: { colorInput: "#ffffff", colorInputForeground: "#171717" } }}
              />
            </Suspense>
          </AuthPageShell>
        </AuthPageReadyGate>
      </ClerkLoaded>
      <ClerkFailed><AuthPageLoadError mode="sign-up" /></ClerkFailed>
    </>
  );
}
