import type { User } from '@/types';

export const mockUser: User = {
  id: 'user_001',
  name: '김민준',
  email: 'minjun.kim@example.com',
  targetExam: '9급_국가직',
  targetScore: 90,
  createdAt: new Date('2024-01-15'),
  avatarUrl: '/mock/avatar.png',
};
