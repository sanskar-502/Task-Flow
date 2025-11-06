import { api } from './axios'
import type { RegisterInput, LoginInput } from './validators'

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export async function register(data: RegisterInput) {
  const response = await api.post<{ user: User }>('/auth/register', data)
  return response.data
}

export async function login(data: LoginInput) {
  const response = await api.post<{ user: User }>('/auth/login', data)
  return response.data
}

export async function logout() {
  const response = await api.post('/auth/logout')
  return response.data
}

export async function getMe() {
  const response = await api.get<{ user: User }>('/users/me')
  return response.data
}

export async function updateProfile(data: { name?: string }) {
  const response = await api.patch<{ user: User }>('/users/me', data)
  return response.data
}

export async function getTasks(params: {
  q?: string
  status?: string
  page?: number
  limit?: number
}) {
  const response = await api.get<{
    items: Task[]
    total: number
    page: number
    pages: number
  }>('/tasks', { params })
  return response.data
}

export async function createTask(data: {
  title: string
  description?: string
  status?: string
  tags?: string[]
}) {
  const response = await api.post<{ task: Task }>('/tasks', data)
  return response.data
}

export async function updateTask(
  id: string,
  data: {
    title?: string
    description?: string
    status?: string
    tags?: string[]
  }
) {
  const response = await api.patch<{ task: Task }>(`/tasks/${id}`, data)
  return response.data
}

export async function deleteTask(id: string) {
  const response = await api.delete<{ ok: boolean }>(`/tasks/${id}`)
  return response.data
}
