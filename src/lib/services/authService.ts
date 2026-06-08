import type { ExamCategory, User } from '@/types';
import type { AuthMeResDto, OAuthLoginReqDto, OAuthLoginResDto } from '@/types/auth-dto';
import { mockUser } from '@/data/mock/user';
import { apiRequest, hasApiBaseUrl } from '@/lib/api/client';
import { tokenStorage } from '@/lib/auth/tokenStorage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  targetExam: ExamCategory;
  targetScore: number;
}

interface AuthResponse {
  user: User;
  token: string;
}

function mapAuthMeToUser(dto: AuthMeResDto): User {
  return {
    id: dto.userId,
    name: dto.name,
    email: dto.email,
    targetExam: dto.targetExam as ExamCategory,
    targetScore: dto.targetScore,
    avatarUrl: dto.avatarUrl ?? undefined,
    createdAt: new Date(dto.createdAt),
  };
}

export const authService = {
  oauthLogin: async (payload: OAuthLoginReqDto): Promise<OAuthLoginResDto> => {
    const tokens = await apiRequest<OAuthLoginResDto>('/auth/oauth/login', {
      method: 'POST',
      body: payload,
    });

    tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    void credentials;

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!credentials.email || !credentials.password) {
      throw new Error('이메일과 비밀번호를 입력해주세요.');
    }

    return Promise.resolve({
      user: mockUser,
      token: 'mock_token_abc123',
    });
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!data.email || !data.password || !data.name) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      targetExam: data.targetExam,
      targetScore: data.targetScore,
      createdAt: new Date(),
    };

    return Promise.resolve({
      user: newUser,
      token: 'mock_token_new_user',
    });
  },

  logout: async (): Promise<void> => {
    tokenStorage.clearTokens();
    await new Promise((resolve) => setTimeout(resolve, 200));
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (hasApiBaseUrl() && tokenStorage.hasAccessToken()) {
      try {
        const me = await apiRequest<AuthMeResDto>('/auth/me');
        return mapAuthMeToUser(me);
      } catch {
        // fall back to mock user for local development
      }
    }

    return Promise.resolve(mockUser);
  },

  updateProfile: async (userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
    void userId;
    const updated: User = { ...mockUser, ...updates };
    return Promise.resolve(updated);
  },
};
