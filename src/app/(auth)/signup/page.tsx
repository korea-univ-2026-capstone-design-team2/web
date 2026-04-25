"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
    email: z.string().email("올바른 이메일 주소를 입력해주세요"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    passwordConfirm: z.string(),
    targetExam: z.string().min(1, "목표 시험을 선택해주세요"),
    targetScore: z
      .string()
      .refine((val) => !val || (Number(val) >= 0 && Number(val) <= 100), {
        message: "점수는 0~100 사이여야 합니다",
      })
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const examOptions = [
  { value: "9급 국가직", label: "9급 국가직" },
  { value: "9급 지방직", label: "9급 지방직" },
  { value: "경찰 공채", label: "경찰 공채" },
  { value: "소방 공채", label: "소방 공채" },
  { value: "5급 PSAT", label: "5급 PSAT" },
  { value: "전산직 9급", label: "전산직 9급" },
];

const inputClass =
  "w-full rounded-[8px] border border-border bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-linear-text-quaternary outline-none transition-colors focus:border-linear-brand-indigo";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
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
        <h1 className="mt-6 text-2xl font-semibold text-foreground">계정 만들기</h1>
        <p className="mt-2 text-sm text-linear-text-tertiary">무료로 시작하세요. 신용카드 불필요.</p>
      </div>

      <div className="rounded-[12px] border border-border bg-white/70 p-6 shadow-[var(--shadow-level-2)] backdrop-blur-sm dark:bg-white/2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">이름</label>
            <input {...register("name")} type="text" placeholder="홍길동" className={inputClass} />
            {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">이메일</label>
            <input {...register("email")} type="email" placeholder="name@example.com" className={inputClass} />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">비밀번호</label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="8자 이상 입력"
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

          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">비밀번호 확인</label>
            <div className="relative">
              <input
                {...register("passwordConfirm")}
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="비밀번호 재입력"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-linear-text-quaternary hover:text-linear-text-tertiary transition-colors"
              >
                {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="mt-1.5 text-xs text-red-500">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">목표 시험</label>
            <select
              {...register("targetExam")}
              className={`${inputClass} cursor-pointer appearance-none pr-9`}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="" className="bg-background text-linear-text-quaternary">
                시험을 선택하세요
              </option>
              {examOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.targetExam && <p className="mt-1.5 text-xs text-red-500">{errors.targetExam.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-linear-text-secondary">
              목표 점수 <span className="font-normal text-linear-text-quaternary">(선택)</span>
            </label>
            <input {...register("targetScore")} type="number" min={0} max={100} placeholder="예: 90" className={inputClass} />
            {errors.targetScore && <p className="mt-1.5 text-xs text-red-500">{errors.targetScore.message}</p>}
          </div>

          <p className="text-[11px] leading-relaxed text-linear-text-quaternary">
            회원가입 시 <Link href="#" className="text-linear-accent-violet hover:underline">이용약관</Link> 및{" "}
            <Link href="#" className="text-linear-accent-violet hover:underline">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-linear-brand-indigo px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-linear-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              "회원가입"
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-linear-text-tertiary">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-linear-accent-violet hover:text-linear-accent-hover transition-colors">
          로그인
        </Link>
      </p>
    </div>
  );
}
