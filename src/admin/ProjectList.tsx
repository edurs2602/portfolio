import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type Project } from '../services/api'

const ProjectList = () => {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getProjects()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return
    await adminApi.deleteProject(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-heading">Projects</h2>
        <Link to="/admin/projects/new" className="btn-primary text-sm">+ Add Project</Link>
      </div>

      {loading ? (
        <p className="text-body">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-body">No projects yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-heading">
                  {p.title}
                  {p.featured && <span className="ml-2 text-xs text-accent">(Featured)</span>}
                </h3>
                <p className="text-sm text-body">{p.type} &middot; {p.tech_stack.join(', ')}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/admin/projects/${p.id}/edit`} className="text-sm text-accent hover:underline">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectList
