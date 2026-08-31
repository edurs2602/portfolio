import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type Experience } from '../services/api'

const ExperienceList = () => {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getExperiences()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this experience?')) return
    await adminApi.deleteExperience(id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-heading">Experiences</h2>
        <Link to="/admin/experiences/new" className="btn-primary text-sm">+ Add Experience</Link>
      </div>

      {loading ? (
        <p className="text-body">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-body">No experiences yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((exp) => (
            <div key={exp.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-heading">{exp.company}</h3>
                <p className="text-sm text-body">{exp.role} &middot; {exp.start_date} — {exp.end_date || 'Present'}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/admin/experiences/${exp.id}/edit`} className="text-sm text-accent hover:underline">Edit</Link>
                <button onClick={() => handleDelete(exp.id)} className="text-sm text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceList
