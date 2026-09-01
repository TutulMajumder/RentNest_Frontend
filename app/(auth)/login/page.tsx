import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "../_components/auth-card";
import LoginForm from "../_components/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your RentNest account.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Enter your credentials to access your dashboard"
    >
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
