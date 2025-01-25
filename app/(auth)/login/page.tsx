import LoginForm from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-500"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
