import { useTranslation } from 'react-i18next'
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'

const Footer = () => {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-muted/10 py-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted">
          &copy; {year} Lu&iacute;s Eduardo. {t('footer.rights')}
        </p>
        <p className="text-xs text-muted">{t('footer.built_with')}</p>
        <div className="flex gap-4 text-body light:text-body-light">
          <a href="https://github.com/edurs2602" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            <AiFillGithub size={20} />
          </a>
          <a href="https://www.linkedin.com/in/edurs2602/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            <AiFillLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
