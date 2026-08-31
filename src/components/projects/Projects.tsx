import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { api, type Project } from '../../services/api'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

const Projects = () => {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    api.getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const getDescription = (p: Project) =>
    i18n.language === 'pt' ? p.description_pt : p.description_en

  const filtered = filter === 'all'
    ? projects
    : projects.filter((p) => p.type === filter)

  const filters = ['all', 'professional', 'freelance'] as const

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">
          {t('projects.title')}<span className="accent-dot">.</span>
        </h2>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-4 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? 'bg-accent text-bg'
                : 'text-body light:text-body-light hover:text-accent border border-muted/20'
            }`}
          >
            {t(`projects.${f}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-body">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className={`card flex flex-col ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-xl text-heading light:text-heading-light">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="text-xs text-accent font-medium">{t('projects.featured')}</span>
                  )}
                </div>
                <div className="flex gap-3 text-body light:text-body-light">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                      <FiExternalLink size={18} />
                    </a>
                  )}
                  {project.repo_url && (
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                      <FiGithub size={18} />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-body light:text-body-light text-sm leading-relaxed mb-4 flex-1">
                {getDescription(project)}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects
