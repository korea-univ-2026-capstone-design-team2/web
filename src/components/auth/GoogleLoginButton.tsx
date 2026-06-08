'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { clickGoogleSignInButton, mountGoogleSignInButton } from '@/lib/auth/googleSignIn';

interface GoogleLoginButtonProps {
  disabled?: boolean;
  onCredential: (idToken: string) => Promise<void> | void;
  onError?: (message: string) => void;
}

export default function GoogleLoginButton({ disabled = false, onCredential, onError }: GoogleLoginButtonProps) {
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(
    async (idToken: string) => {
      setIsLoading(true);
      try {
        await onCredential(idToken);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Google 로그인에 실패했습니다.';
        onError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    [onCredential, onError],
  );

  useEffect(() => {
    if (!clientId || !hiddenButtonRef.current) return;

    const cleanup = mountGoogleSignInButton(
      hiddenButtonRef.current,
      clientId,
      (idToken) => {
        void handleCredential(idToken);
      },
      (error) => {
        onError?.(error.message);
      },
    );

    setIsReady(true);
    return cleanup;
  }, [clientId, handleCredential, onError]);

  function handleClick() {
    if (!clientId) {
      onError?.('NEXT_PUBLIC_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
      return;
    }

    if (!isReady) {
      onError?.('Google 로그인을 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const clicked = clickGoogleSignInButton(hiddenButtonRef.current);
    if (!clicked) {
      onError?.('Google 로그인 버튼을 열지 못했습니다.');
    }
  }

  return (
    <>
      <div ref={hiddenButtonRef} className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true" />
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2.5 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-[#1F2937] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Google 로그인 중...
          </>
        ) : (
          <>
            <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
              <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.85 1.15 7.96 3.04l5.66-5.66C34.56 6.53 29.59 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z" />
              <path fill="#FF3D00" d="M6.31 14.69l6.57 4.82C14.66 16.11 18.99 12 24 12c3.06 0 5.85 1.15 7.96 3.04l5.66-5.66C34.56 6.53 29.59 4 24 4c-7.68 0-14.32 4.34-17.69 10.69z" />
              <path fill="#4CAF50" d="M24 44c5.48 0 10.37-2.1 14.08-5.53l-6.5-5.5C29.54 34.32 26.88 35.2 24 35.2c-5.2 0-9.62-3.32-11.24-7.92l-6.52 5.02C9.57 39.57 16.23 44 24 44z" />
              <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3c-.78 2.38-2.3 4.33-4.42 5.67l6.5 5.5C41.16 35.68 44 30.36 44 24c0-1.34-.14-2.65-.39-3.92z" />
            </svg>
            Google로 로그인
          </>
        )}
      </button>
    </>
  );
}
