"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { useAuthStore } from "@/lib/store/authStore";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const inputClass =
  "w-full rounded-[8px] border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-linear-text-quaternary outline-none transition-colors focus:border-linear-brand-indigo";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const loginWithOAuth = useAuthStore((state) => state.loginWithOAuth);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push("/dashboard");
  };

  async function handleGoogleLogin(idToken: string) {
    setOauthError(null);
    clearError();
    const success = await loginWithOAuth("GOOGLE", idToken);
    if (success) {
      router.push("/dashboard");
      return;
    }
    setOauthError(useAuthStore.getState().error ?? "Google 로그인에 실패했습니다.");
  }

  return (
    <div className="space-y-7">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-semibold text-foreground text-xl tracking-tight">PassFinder</span>
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-foreground">다시 오셨군요</h1>
        <p className="mt-2 text-sm text-linear-text-tertiary">계정에 로그인하세요</p>
      </div>

      <div className="rounded-[12px] border border-border bg-white/70 p-6 shadow-[var(--shadow-level-2)] backdrop-blur-sm dark:bg-white/2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">이메일</label>
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={inputClass}
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-linear-text-secondary">비밀번호</label>
              <Link href="#" className="text-xs text-linear-accent-violet hover:text-linear-accent-hover transition-colors">
                비밀번호 찾기
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-linear-text-quaternary hover:text-linear-text-tertiary transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-linear-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-linear-text-quaternary">또는</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2.5">
          <GoogleLoginButton
            disabled={isLoading}
            onCredential={handleGoogleLogin}
            onError={(message) => setOauthError(message)}
          />
          {(oauthError || authError) && (
            <p className="text-xs text-red-500">{oauthError ?? authError}</p>
          )}
        </div>
      </div>

      <p className="text-center text-sm text-linear-text-tertiary">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-medium text-linear-accent-violet hover:text-linear-accent-hover transition-colors">
          회원가입
        </Link>
      </p>
    </div>
  );
}
