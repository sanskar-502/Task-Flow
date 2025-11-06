'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/auth.store'
import { updateProfile } from '@/lib/auth'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await updateProfile(data)
      setUser(response.user)
      setSuccess('Profile updated successfully')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="space-y-4">
          <div>
            <span className="label">Email</span>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <span className="label">Role</span>
            <p className="text-gray-900 capitalize">{user.role}</p>
          </div>
          <div>
            <span className="label">Member since</span>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" type="text" className="input" {...register('name')} />
            {errors.name && <p className="error">{errors.name.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
