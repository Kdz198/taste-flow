import LoginForm from "./LoginForm";
import { Metadata } from "next";

// ✅ Tạo meta cho SEO
export const metadata: Metadata = {
  title: "Login - Forkful",
  description: "Sign in to access your Forkful account and manage your recipes.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mt-20">
      <LoginForm />
    </div>
  );
}
