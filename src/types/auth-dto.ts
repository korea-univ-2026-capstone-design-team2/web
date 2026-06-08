export type OAuthProvider = 'GOOGLE';

export interface OAuthLoginReqDto {
  provider: OAuthProvider;
  idToken: string;
}

export interface OAuthLoginResDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthMeResDto {
  userId: string;
  email: string;
  name: string;
  targetExam: string;
  targetScore: number;
  avatarUrl: string | null;
  createdAt: string;
}
