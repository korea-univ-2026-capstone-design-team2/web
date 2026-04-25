import type { ExamCategory, User } from '@/types';
import { mockUser } from '@/data/mock/user';

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

export const authService = {
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
    await new Promise((resolve) => setTimeout(resolve, 200));
    return Promise.resolve();
  },

  getCurrentUser: async (): Promise<User | null> => {
    return Promise.resolve(mockUser);
  },

  updateProfile: async (userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
    void userId;
    const updated: User = { ...mockUser, ...updates };
    return Promise.resolve(updated);
  },
};
