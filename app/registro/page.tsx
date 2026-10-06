import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function RegistroPage() {
  return (
    <Suspense>
      <AuthForm mode="registro" />
    </Suspense>
  );
}
