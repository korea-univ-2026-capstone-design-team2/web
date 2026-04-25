"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

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

  return (
    <div className="space-y-7">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="font-semibold text-foreground text-xl lowercase tracking-tight">oh-my-study</span>
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
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-[#1F2937] transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
              <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.85 1.15 7.96 3.04l5.66-5.66C34.56 6.53 29.59 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z" />
              <path fill="#FF3D00" d="M6.31 14.69l6.57 4.82C14.66 16.11 18.99 12 24 12c3.06 0 5.85 1.15 7.96 3.04l5.66-5.66C34.56 6.53 29.59 4 24 4c-7.68 0-14.32 4.34-17.69 10.69z" />
              <path fill="#4CAF50" d="M24 44c5.48 0 10.37-2.1 14.08-5.53l-6.5-5.5C29.54 34.32 26.88 35.2 24 35.2c-5.2 0-9.62-3.32-11.24-7.92l-6.52 5.02C9.57 39.57 16.23 44 24 44z" />
              <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3c-.78 2.38-2.3 4.33-4.42 5.67l6.5 5.5C41.16 35.68 44 30.36 44 24c0-1.34-.14-2.65-.39-3.92z" />
            </svg>
            Google로 로그인
          </button>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2.5 rounded-[8px] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#03C75A" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
            </svg>
            네이버 로그인
          </button>
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
