'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ensureGoogleSignIn,
  renderGoogleSignInButton,
  setGoogleCredentialHandler,
} from '@/lib/auth/googleSignIn';

interface GoogleLoginButtonProps {
  disabled?: boolean;
  onCredential: (idToken: string) => Promise<void> | void;
  onError?: (message: string) => void;
}

export default function GoogleLoginButton({ disabled = false, onCredential, onError }: GoogleLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!clientId || !overlayRef.current || !containerRef.current) return;

    let cancelled = false;

    setGoogleCredentialHandler((idToken) => {
      setIsLoading(true);
      void Promise.resolve(onCredentialRef.current(idToken))
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : 'Google 로그인에 실패했습니다.';
          onErrorRef.current?.(message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });

    void ensureGoogleSignIn(clientId)
      .then(() => {
        if (cancelled || !overlayRef.current || !containerRef.current) return;

        const width = containerRef.current.offsetWidth;
        renderGoogleSignInButton(overlayRef.current, width);
        setIsReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Google 로그인 초기화에 실패했습니다.';
        onErrorRef.current?.(message);
      });

    return () => {
      cancelled = true;
      setGoogleCredentialHandler(null);
      if (overlayRef.current) overlayRef.current.innerHTML = '';
      setIsReady(false);
    };
  }, [clientId]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-linear-text-tertiary opacity-60"
      >
        Google 로그인 (Client ID 미설정)
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none flex w-full items-center justify-center gap-2.5 rounded-[8px] border border-border bg-white px-4 py-3 text-sm font-medium text-[#1F2937]"
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
      </div>

      <div
        ref={overlayRef}
        className={cn(
          'absolute inset-0 z-10 overflow-hidden opacity-[0.01]',
          (disabled || isLoading || !isReady) && 'pointer-events-none',
        )}
        aria-label="Google로 로그인"
      />
    </div>
  );
}
