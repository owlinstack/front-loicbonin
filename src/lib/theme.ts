export type Theme = 'dark' | 'light'

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem('lb-theme') as Theme) ?? 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try {
    localStorage.setItem('lb-theme', theme)
  } catch (_) {}
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark'
}
