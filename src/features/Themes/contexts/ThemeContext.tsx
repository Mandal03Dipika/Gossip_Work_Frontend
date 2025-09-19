import React, { createContext, useContext, useState } from 'react'
import type { ThemeTypes } from '@/types/ThemeTypes'
import { themeBackgrounds, themeChats } from '@/constants/constants'

const ThemeContext = createContext<ThemeTypes | null>(null)

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [theme, _setTheme] = useState('coffee')
  const [bgImage, setBgImage] = useState(themeBackgrounds['coffee'])
  const [chatImage, setChatImage] = useState(themeChats['coffee'])

  const setTheme = (newTheme: string) => {
    localStorage.setItem('chat-theme', newTheme)
    _setTheme(() => newTheme)
    setBgImage(() => themeBackgrounds[newTheme])
    setChatImage(() => themeChats[newTheme])
  }

  return (
    <ThemeContext.Provider value={{ theme, bgImage, chatImage, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = useContext(ThemeContext)
