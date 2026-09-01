import type { Metadata } from "next";

import { AuthCard } from "../_components/auth-card";
import RegisterForm from "../_components/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Join RentNest to start renting or listing properties.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Join RentNest to start renting or listing properties"
    >
      <RegisterForm />
    </AuthCard>
  );
}
