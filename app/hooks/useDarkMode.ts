import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem('darkMode')

    const applyTheme = (dark: boolean) => {
      setIsDark(dark)
      if (dark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (stored === 'true') {
      applyTheme(true)
    } else if (stored === 'false') {
      applyTheme(false)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const storedPref = localStorage.getItem('darkMode')
      if (storedPref === null) {
        applyTheme(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    const newValue = !isDark
    localStorage.setItem('darkMode', newValue.toString())
    setIsDark(newValue)
    document.documentElement.classList.toggle('dark', newValue)
  }

  return { isDark, toggleDarkMode }
}
