import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api, type Experience } from '../../services/api'

const Exp = () => {
  const { t, i18n } = useTranslation()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getExperiences()
      .then(setExperiences)
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false))
  }, [])

  const getDescription = (exp: Experience) =>
    i18n.language === 'pt' ? exp.description_pt : exp.description_en

  const formatDate = (date: string | null) => {
    if (!date) return t('experience.present')
    return date
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
          {t('experience.title')}<span className="accent-dot">.</span>
        </h2>
      </motion.div>

      {loading ? (
        <div className="text-body">Loading...</div>
      ) : (
        <div className="relative max-w-3xl">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-muted/30" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="relative pl-12"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-bg light:border-bg-light" />

                <div className="card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <h3 className="font-heading font-semibold text-xl text-heading light:text-heading-light">
                      {exp.company}
                    </h3>
                    <span className="text-sm text-accent font-medium">
                      {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-accent-secondary font-medium text-sm mb-3">{exp.role}</p>
                  {exp.location && (
                    <p className="text-xs text-muted mb-3">{exp.location}</p>
                  )}
                  <p className="text-body light:text-body-light leading-relaxed">
                    {getDescription(exp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Exp
