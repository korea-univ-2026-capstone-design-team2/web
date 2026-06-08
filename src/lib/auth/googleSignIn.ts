const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

interface GoogleCredentialResponse {
  credential?: string;
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.')));
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google 로그인 스크립트를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function mountGoogleSignInButton(
  container: HTMLElement,
  clientId: string,
  onCredential: (idToken: string) => void,
  onError?: (error: Error) => void,
): () => void {
  let cancelled = false;

  void loadGoogleScript()
    .then(() => {
      if (cancelled || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: GoogleCredentialResponse) => {
          if (response.credential) {
            onCredential(response.credential);
            return;
          }
          onError?.(new Error('Google ID 토큰을 받지 못했습니다.'));
        },
      });

      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: container.offsetWidth || 320,
        locale: 'ko',
      });
    })
    .catch((error: unknown) => {
      onError?.(error instanceof Error ? error : new Error('Google 로그인 초기화에 실패했습니다.'));
    });

  return () => {
    cancelled = true;
    container.innerHTML = '';
  };
}

export function clickGoogleSignInButton(container: HTMLElement | null): boolean {
  if (!container) return false;
  const button = container.querySelector('[role="button"]') as HTMLElement | null;
  if (!button) return false;
  button.click();
  return true;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}
