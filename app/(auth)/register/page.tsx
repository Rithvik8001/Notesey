import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <RegisterForm />
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
