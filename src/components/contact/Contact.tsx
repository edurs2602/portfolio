import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { api } from '../../services/api'

const Contact = () => {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.sendContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">
          {t('contact.title')}<span className="accent-dot">.</span>
        </h2>
        <p className="text-body light:text-body-light text-lg max-w-xl mb-10">
          {t('contact.description')}
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-heading light:text-heading-light mb-2">
              {t('contact.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('contact.name_placeholder')}
              required
              className="w-full px-4 py-3 bg-surface light:bg-surface-light border border-muted/20 rounded-lg text-heading light:text-heading-light placeholder-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-heading light:text-heading-light mb-2">
              {t('contact.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('contact.email_placeholder')}
              required
              className="w-full px-4 py-3 bg-surface light:bg-surface-light border border-muted/20 rounded-lg text-heading light:text-heading-light placeholder-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-heading light:text-heading-light mb-2">
            {t('contact.subject')}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder={t('contact.subject_placeholder')}
            required
            className="w-full px-4 py-3 bg-surface light:bg-surface-light border border-muted/20 rounded-lg text-heading light:text-heading-light placeholder-muted focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-heading light:text-heading-light mb-2">
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            placeholder={t('contact.message_placeholder')}
            required
            className="w-full px-4 py-3 bg-surface light:bg-surface-light border border-muted/20 rounded-lg text-heading light:text-heading-light placeholder-muted focus:border-accent focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? t('contact.sending') : t('contact.send')}
        </button>

        {status === 'success' && (
          <p className="text-green-400 text-sm">{t('contact.success')}</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm">{t('contact.error')}</p>
        )}
      </motion.form>
    </div>
  )
}

export default Contact
