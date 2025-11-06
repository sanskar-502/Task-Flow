'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTasks } from '@/lib/auth'
import TaskTable from '@/components/TaskTable'
import TaskForm from '@/components/TaskForm'

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tasks', search, status, page],
    queryFn: () => getTasks({ q: search, status, page, limit: 10 }),
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary w-full sm:w-auto">
          Create Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="label">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="input"
            >
              <option value="">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-xl">Loading tasks...</div>
        </div>
      ) : !data?.items.length ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4">
            Create your first task
          </button>
        </div>
      ) : (
        <>
          <TaskTable tasks={data.items} onRefresh={refetch} />

          {data.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {data.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="btn btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && <TaskForm onClose={() => setShowForm(false)} onSuccess={refetch} />}
    </div>
  )
}
