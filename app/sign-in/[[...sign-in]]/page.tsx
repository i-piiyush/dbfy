import { ClerkFailed, ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/ui/themes";
import { Suspense } from "react";
import AuthPageShell, { AuthPageLoadError, AuthPageLoader } from "@/components/AuthPageShell";
import AuthPageReadyGate from "@/components/AuthPageReadyGate";

export default function SignInPage() {
  return (
    <>
      <ClerkLoading><AuthPageLoader mode="sign-in" /></ClerkLoading>
      <ClerkLoaded>
        <AuthPageReadyGate mode="sign-in">
          <AuthPageShell mode="sign-in">
            <Suspense fallback={<AuthPageLoader mode="sign-in" />}>
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                appearance={{ theme: neobrutalism, variables: { colorInput: "#ffffff", colorInputForeground: "#171717" } }}
              />
            </Suspense>
          </AuthPageShell>
        </AuthPageReadyGate>
      </ClerkLoaded>
      <ClerkFailed><AuthPageLoadError mode="sign-in" /></ClerkFailed>
    </>
  );
}
