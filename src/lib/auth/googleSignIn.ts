const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

interface GoogleCredentialResponse {
  credential?: string;
}

let scriptPromise: Promise<void> | null = null;
let initializedClientId: string | null = null;
let credentialHandler: ((idToken: string) => void) | null = null;

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

export function setGoogleCredentialHandler(handler: ((idToken: string) => void) | null): void {
  credentialHandler = handler;
}

export async function ensureGoogleSignIn(clientId: string): Promise<void> {
  const normalizedClientId = clientId.trim();
  await loadGoogleScript();

  if (!window.google?.accounts?.id) {
    throw new Error('Google 로그인을 초기화하지 못했습니다.');
  }

  if (initializedClientId === normalizedClientId) return;

  window.google.accounts.id.initialize({
    client_id: normalizedClientId,
    callback: (response: GoogleCredentialResponse) => {
      if (response.credential) {
        credentialHandler?.(response.credential);
        return;
      }
    },
  });

  initializedClientId = normalizedClientId;
}

export function renderGoogleSignInButton(container: HTMLElement, width: number): void {
  if (!window.google?.accounts?.id) return;

  container.innerHTML = '';
  window.google.accounts.id.renderButton(container, {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'signin_with',
    width: Math.max(width, 240),
    locale: 'ko',
  });
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
