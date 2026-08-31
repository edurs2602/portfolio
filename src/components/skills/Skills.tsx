import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const skillCategories = [
  { key: 'backend', items: ['Python', 'Django', 'DRF', 'Flask', 'FastAPI'] },
  { key: 'frontend', items: ['React', 'Vue', 'TypeScript', 'Tailwind CSS'] },
  { key: 'databases', items: ['PostgreSQL', 'MySQL'] },
  { key: 'devops', items: ['Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Azure DevOps', 'Azure Repos'] },
  { key: 'cloud', items: ['AWS', 'Azure', 'DigitalOcean', 'Vercel'] },
  { key: 'testing', items: ['Pytest', 'Unittest'] },
]

const Skills = () => {
  const { t } = useTranslation()

  return (
    <div className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="section-title">
          {t('skills.title')}<span className="accent-dot">.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
        {skillCategories.map((cat, i) => (
          <motion.div
            key={cat.key}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <h3 className="font-heading font-semibold text-lg text-accent mb-4">
              {t(`skills.${cat.key}`)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((skill) => (
                <span key={skill} className="chip">{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Skills
