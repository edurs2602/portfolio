import { useEffect, useState } from 'react'
import { adminApi, type ResumeStatus } from '../services/api'

const MAX_SIZE = 10 * 1024 * 1024

const LANGS: { key: 'pt' | 'en'; label: string }[] = [
  { key: 'pt', label: 'Português (PT)' },
  { key: 'en', label: 'English (EN)' },
]

const ResumeAdmin = () => {
  const [status, setStatus] = useState<{ pt: ResumeStatus; en: ResumeStatus } | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<{ pt: boolean; en: boolean }>({ pt: false, en: false })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadStatus = () => {
    setLoading(true)
    adminApi.getResumeStatus()
      .then(setStatus)
      .catch(() => setMessage({ type: 'error', text: 'Failed to load resume status.' }))
      .finally(() => setLoading(false))
  }

  useEffect(loadStatus, [])

  const handleUpload = async (lang: 'pt' | 'en', file: File) => {
    setMessage(null)
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Only PDF files are accepted.' })
      return
    }
    if (file.size > MAX_SIZE) {
      setMessage({ type: 'error', text: 'File too large. Maximum size is 10 MB.' })
      return
    }
    setUploading((prev) => ({ ...prev, [lang]: true }))
    try {
      await adminApi.uploadResume(lang, file)
      setMessage({ type: 'success', text: `Resume (${lang.toUpperCase()}) uploaded successfully.` })
      loadStatus()
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Upload failed.' })
    } finally {
      setUploading((prev) => ({ ...prev, [lang]: false }))
    }
  }

  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold text-heading">Currículo</h2>
        <p className="text-body mt-1 text-sm">Faça upload dos currículos em PDF para PT e EN.</p>
      </div>

      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-body">Loading...</p>
      ) : (
        <div className="space-y-4">
          {LANGS.map(({ key, label }) => {
            const info = status?.[key]
            const isUploading = uploading[key]
            return (
              <div key={key} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-heading font-medium">{label}</p>
                  {info?.exists ? (
                    <p className="text-body text-sm mt-1">
                      <span className="text-green-400 font-medium">Uploaded</span>
                      {info.size && ` · ${formatSize(info.size)}`}
                      {info.last_modified && ` · ${formatDate(info.last_modified)}`}
                    </p>
                  ) : (
                    <p className="text-muted text-sm mt-1">Not uploaded</p>
                  )}
                </div>
                <label className={`btn-outline text-sm cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {isUploading ? 'Uploading...' : info?.exists ? 'Replace PDF' : 'Upload PDF'}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(key, file)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ResumeAdmin
