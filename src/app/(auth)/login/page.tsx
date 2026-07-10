import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center flex flex-col items-center gap-2">
        <img
          src="/aara-logo.jpg"
          alt="Aara Clothing"
          className="h-12 w-auto"
        />
        <h1 className="text-2xl font-semibold tracking-tight">
          Aara Clothing
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
