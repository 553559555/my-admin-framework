import request from './request'

export interface UserProfile {
  id: number
  username: string
  nickname: string
  email: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
}

export function getUserProfile() {
  return request.get<UserProfile>('/user/profile')
}

export function login(data: LoginParams) {
  return request.post<LoginResult, LoginParams>('/auth/login', data, {
    skipAuth: true,
  })
}