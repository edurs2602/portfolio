import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'
import profileImg from '../../assets/profile.jpg'
import { api } from '../../services/api'

const Banner = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.startsWith('pt') ? 'pt' : 'en'
  const resumeUrl = api.getResumeUrl(lang)

  return (
    <div className="section-container flex flex-col-reverse lg:flex-row items-center justify-between gap-12 min-h-[calc(100vh-4rem)]">
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-accent font-medium mb-4 text-lg">{t('hero.greeting')} 👋</p>
        <h1 className="font-heading text-5xl lg:text-7xl font-bold text-heading light:text-heading-light leading-tight mb-6">
          {t('hero.role')}
        </h1>
        <p className="text-body light:text-body-light text-lg lg:text-xl max-w-xl mb-8 leading-relaxed">
          {t('hero.tagline')}
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <a href="#Contact" className="btn-primary">{t('hero.cta_contact')}</a>
          <a
            href={resumeUrl}
            download={`resume_${lang}.pdf`}
            className="btn-outline"
          >
            {t('hero.cta_resume')}
          </a>
        </div>

        <div className="flex gap-4">
          <a href="https://github.com/edurs2602" target="_blank" rel="noopener noreferrer" className="text-body light:text-body-light hover:text-accent transition-colors text-2xl glow rounded-full p-2">
            <AiFillGithub />
          </a>
          <a href="https://www.linkedin.com/in/edurs2602/" target="_blank" rel="noopener noreferrer" className="text-body light:text-body-light hover:text-accent transition-colors text-2xl glow rounded-full p-2">
            <AiFillLinkedin />
          </a>
        </div>
      </motion.div>

      <motion.div
        className="flex-shrink-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative">
          <img
            src={profileImg}
            alt="Luís Eduardo"
            className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-accent/30 shadow-lg shadow-accent/10"
          />
          <div className="absolute inset-0 rounded-full border-2 border-accent/10 scale-110" />
        </div>
      </motion.div>
    </div>
  )
}

export default Banner
