import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../services/api'

const ProjectForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    title: '',
    description_en: '',
    description_pt: '',
    tech_stack: '',
    live_url: '',
    repo_url: '',
    image_url: '',
    type: 'professional' as 'freelance' | 'personal' | 'professional',
    featured: false,
    order: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      adminApi.getProjects().then((items) => {
        const item = items.find((p) => p.id === Number(id))
        if (item) {
          setForm({
            title: item.title,
            description_en: item.description_en,
            description_pt: item.description_pt,
            tech_stack: item.tech_stack.join(', '),
            live_url: item.live_url || '',
            repo_url: item.repo_url || '',
            image_url: item.image_url || '',
            type: item.type,
            featured: item.featured,
            order: item.order,
          })
        }
      })
    }
  }, [id, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setForm((f) => ({ ...f, [name]: name === 'order' ? Number(value) : value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...form,
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      live_url: form.live_url || null,
      repo_url: form.repo_url || null,
      image_url: form.image_url || null,
    }
    try {
      if (isEdit) {
        await adminApi.updateProject(Number(id), data)
      } else {
        await adminApi.createProject(data)
      }
      navigate('/admin/projects')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 bg-surface border border-muted/20 rounded-lg text-heading placeholder-muted focus:border-accent focus:outline-none'

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-heading mb-6">
        {isEdit ? 'Edit Project' : 'New Project'}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm text-body mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-body mb-1">Description (EN)</label>
          <textarea name="description_en" value={form.description_en} onChange={handleChange} rows={3} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-body mb-1">Description (PT)</label>
          <textarea name="description_pt" value={form.description_pt} onChange={handleChange} rows={3} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm text-body mb-1">Tech Stack (comma separated)</label>
          <input name="tech_stack" value={form.tech_stack} onChange={handleChange} placeholder="Django, PostgreSQL, Docker" required className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-body mb-1">Live URL (optional)</label>
            <input name="live_url" value={form.live_url} onChange={handleChange} placeholder="https://..." className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-body mb-1">Repo URL (optional)</label>
            <input name="repo_url" value={form.repo_url} onChange={handleChange} placeholder="https://github.com/..." className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-body mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
              <option value="professional">Professional</option>
              <option value="freelance">Freelance</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-body mb-1">Display Order</label>
            <input type="number" name="order" value={form.order} onChange={handleChange} className={inputClass} />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 text-sm text-body cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-accent" />
              Featured
            </label>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
