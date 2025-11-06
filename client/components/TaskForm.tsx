'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createTaskSchema, type CreateTaskInput } from '@/lib/validators'
import { createTask, updateTask } from '@/lib/auth'

interface TaskFormProps {
  task?: {
    id: string
    title: string
    description?: string
    status: string
    tags?: string[]
  }
  onClose: () => void
  onSuccess: () => void
}

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [error, setError] = useState('')
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(', ') || '')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          status: task.status as any,
        }
      : {
          status: 'todo',
        },
  })

  const mutation = useMutation({
    mutationFn: task ? (data: any) => updateTask(task.id, data) : createTask,
    onSuccess: () => {
      onClose()
      onSuccess()
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Operation failed')
    },
  })

  const onSubmit = (data: CreateTaskInput) => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    mutation.mutate({ ...data, tags: tags.length ? tags : undefined })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="label">
              Title
            </label>
            <input id="title" type="text" className="input" {...register('title')} />
            {errors.title && <p className="error">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              className="input"
              {...register('description')}
            />
            {errors.description && <p className="error">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select id="status" className="input" {...register('status')}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            {errors.status && <p className="error">{errors.status.message}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="label">
              Tags (comma-separated, optional)
            </label>
            <input
              id="tags"
              type="text"
              className="input"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="work, urgent, personal"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
