import { createContext, useContext, useEffect, useState } from 'react'
import { dict } from './translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ar')

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title =
      lang === 'ar' ? 'قسّمها — دفتر مصاريف الرفقة' : 'Qassamha — split group expenses'
  }, [lang])

  function switchLang(next) {
    localStorage.setItem('lang', next)
    setLang(next)
  }

  const t = (key, vars) => {
    let s = dict[lang][key] ?? dict.ar[key] ?? key
    for (const [k, v] of Object.entries(vars || {})) {
      s = s.replaceAll(`{${k}}`, v)
    }
    return s
  }

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

// server errors come back in arabic, so in english mode fall back to a generic message
export function useApiError() {
  const { lang, t } = useLang()
  return (err) => {
    const msg = err?.response?.data?.error
    if (msg && !(lang === 'en' && /[؀-ۿ]/.test(msg))) return msg
    return t('errorGeneric')
  }
}
