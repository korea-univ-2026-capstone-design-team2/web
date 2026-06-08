import type { User } from '@/types';

export const mockUser: User = {
  id: 'user_001',
  name: '사용자',
  email: 'user@example.com',
  targetExam: '5급_PSAT',
  targetScore: 90,
  createdAt: new Date('2024-01-15'),
  avatarUrl: '/mock/avatar.png',
};
