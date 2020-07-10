export interface UserProfile {
  // 이메일
  email: string;
  // 이름
  name: string;
}

export interface UserSignup extends UserProfile {
  // 사용자명
  username: string;
  // 비밀번호 (해시)
  password: string;
  // 사용자 종류
  type: 'manager' | 'user';
}

export default interface User extends UserSignup {
  // 생성일자
  createdAt: Date;
  updatedAt: Date;
}