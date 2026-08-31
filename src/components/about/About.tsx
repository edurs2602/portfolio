import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const About = () => {
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
          {t('about.title')}<span className="accent-dot">.</span>
        </h2>
      </motion.div>

      <div className="max-w-3xl space-y-6">
        {['p1', 'p2', 'p3'].map((key, i) => (
          <motion.p
            key={key}
            className="text-lg leading-relaxed text-body light:text-body-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            {t(`about.${key}`)}
          </motion.p>
        ))}
      </div>
    </div>
  )
}

export default About
