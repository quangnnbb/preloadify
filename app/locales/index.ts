import en from './en.json'
import fr from './fr.json'

type Dict = Record<string, any>
const dictionaries: Record<string, Dict> = { english: en as Dict, french: fr as Dict }

export function getCurrentLanguage(): string {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    const dataLang = html.getAttribute('data-lang') || ''
    if (dataLang) return dataLang
  }
  try {
    const cached = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('preloaders.ui.language')
    if (cached) return cached
  } catch {}
  return 'english'
}

function getByPath(obj: any, path: string): any {
  if (!obj) return undefined
  const parts = path.split('.')
  let cur: any = obj
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = cur[p]
    } else {
      return undefined
    }
  }
  return typeof cur === 'string' ? cur : undefined
}

export function t(key: string): string {
  const lang = getCurrentLanguage()
  const dict = dictionaries[lang] || dictionaries['english']
  return (
    getByPath(dict, key) ||
    getByPath(dictionaries['english'], key) ||
    key
  )
}


