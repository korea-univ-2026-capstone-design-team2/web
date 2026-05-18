import type { User } from '@/types';

export const mockUser: User = {
  id: 'user_001',
  name: '양인용',
  email: 'inyong.yang@example.com',
  targetExam: '9급_국가직',
  targetScore: 90,
  createdAt: new Date('2024-01-15'),
  avatarUrl: '/mock/avatar.png',
};
