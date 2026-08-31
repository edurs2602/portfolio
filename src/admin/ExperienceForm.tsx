import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../services/api'

const ExperienceForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    company: '',
    role: '',
    description_en: '',
    description_pt: '',
    start_date: '',
    end_date: '',
    location: '',
    order: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      adminApi.getExperiences().then((items) => {
        const item = items.find((e) => e.id === Number(id))
        if (item) {
          setForm({
            company: item.company,
            role: item.role,
            description_en: item.description_en,
            description_pt: item.description_pt,
            start_date: item.start_date,
            end_date: item.end_date || '',
            location: item.location,
            order: item.order,
          })
        }
      })
    }
  }, [id, isEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === 'order' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = { ...form, end_date: form.end_date || null }
    try {
      if (isEdit) {
        await adminApi.updateExperience(Number(id), data)
      } else {
        await adminApi.createExperience(data)
      }
      navigate('/admin/experiences')
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
        {isEdit ? 'Edit Experience' : 'New Experience'}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-body mb-1">Company</label>
            <input name="company" value={form.company} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-body mb-1">Role</label>
            <input name="role" value={form.role} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-body mb-1">Start Date</label>
            <input name="start_date" value={form.start_date} onChange={handleChange} placeholder="Aug 2024" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-body mb-1">End Date (empty = present)</label>
            <input name="end_date" value={form.end_date} onChange={handleChange} placeholder="Leave empty for current" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-body mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="Natal, RN, Brazil" className={inputClass} />
          </div>
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
          <label className="block text-sm text-body mb-1">Display Order</label>
          <input type="number" name="order" value={form.order} onChange={handleChange} className={inputClass} />
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={() => navigate('/admin/experiences')} className="btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default ExperienceForm
