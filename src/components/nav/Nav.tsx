import { useState } from 'react'
import { Link } from 'react-scroll'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { CiMenuFries } from 'react-icons/ci'
import { HiSun, HiMoon } from 'react-icons/hi'

type NavProps = {
  toggleTheme: () => void
  isLight: boolean
}

const Nav = ({ toggleTheme, isLight }: NavProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()

  const toggleLang = () => {
    const next = i18n.language === 'en' ? 'pt' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const sections = [
    { to: 'Home', label: t('nav.home') },
    { to: 'About', label: t('nav.about') },
    { to: 'Experience', label: t('nav.experience') },
    { to: 'Projects', label: t('nav.projects') },
    { to: 'Skills', label: t('nav.skills') },
    { to: 'Contact', label: t('nav.contact') },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 light:bg-bg-light/80 border-b border-muted/10">
      <div className="max-w-6xl mx-auto px-6 lg:px-16 flex items-center justify-between h-16">
        <a href="/" className="font-heading font-bold text-xl text-heading light:text-heading-light">
          Eduardo<span className="accent-dot">.</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {sections.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                spy smooth
                offset={-64}
                className="text-sm text-body light:text-body-light hover:text-accent transition-colors cursor-pointer"
                activeClass="!text-accent"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold px-2 py-1 rounded border border-muted/30 text-body light:text-body-light hover:border-accent hover:text-accent transition-colors"
          >
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>

          <button onClick={toggleTheme} className="text-xl text-body light:text-body-light hover:text-accent transition-colors">
            {isLight ? <HiMoon /> : <HiSun />}
          </button>

          <button className="md:hidden text-xl text-body light:text-body-light" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <CiMenuFries />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-muted/10 bg-bg light:bg-bg-light"
          >
            <ul className="flex flex-col px-6 py-4">
              {sections.map((s) => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    spy smooth
                    offset={-64}
                    className="block py-3 text-body light:text-body-light hover:text-accent transition-colors cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Nav
