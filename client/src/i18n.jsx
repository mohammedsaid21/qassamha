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

// the api returns fixed english messages, map them so both languages read naturally
const serverErrors = {
  'name, email and password are required': 'errFieldsRequired',
  'password must be at least 6 characters': 'errShortPassword',
  'this email is already registered': 'errEmailTaken',
  'wrong email or password': 'errWrongLogin',
  'user not found': 'errWrongLogin',
  'invalid token': 'errWrongLogin',
  'group not found': 'errNotFound',
  'expense not found': 'errNotFound',
  'member not found': 'errNotFound',
  'you are not a member of this group': 'errNotMember',
  'payer is not a member of this group': 'errNotMember',
  'split members must belong to the group': 'errNotMember',
  'group name is required': 'errGroupNameRequired',
  'only the owner can rename the group': 'errOnlyOwnerRename',
  'description is required': 'errDescriptionRequired',
  'amount must be a positive number': 'errAmountPositive',
  'only the payer or the owner can delete an expense': 'errOnlyOwnerDelete',
  'member email is required': 'errMemberEmailRequired',
  'no user with this email': 'errNoUser',
  'already a member': 'errAlreadyMember',
  'cannot remove the group owner': 'errCannotRemoveOwner',
  'only the owner can remove members': 'errOnlyOwnerRemove',
  'this member has expenses and cannot be removed': 'errMemberHasExpenses',
}

// takes the raw api error string, call it at render time so it follows the active language
export function useApiError() {
  const { t } = useLang()
  return (msg) => {
    if (!msg) return t('errorGeneric')
    return serverErrors[msg] ? t(serverErrors[msg]) : msg
  }
}
