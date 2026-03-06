import { config as tamaguiConfig } from '@tamagui/config/v3'
import { createTamagui, createTokens } from 'tamagui'

const tokens = createTokens({
  ...tamaguiConfig.tokens,
  color: {
    ...tamaguiConfig.tokens.color,
    // Dark (witchy)
    darkBg: '#0d0814',
    darkBg2: '#150d1f',
    darkCard: '#1e1530',
    darkBorder: '#2d1f45',
    darkPrimary: '#7c3aed',
    darkPrimaryLight: '#a855f7',
    darkText: '#f3e8ff',
    darkTextMuted: '#a78bca',
    // Light (cottagecore)
    lightBg: '#faf5ff',
    lightBg2: '#f3e8ff',
    lightCard: '#ffffff',
    lightBorder: '#ddd6fe',
    lightPrimary: '#7c3aed',
    lightPrimaryLight: '#a855f7',
    lightText: '#1e1038',
    lightTextMuted: '#6b4fa0',
  },
})

const darkTheme = {
  background: '#0d0814',
  backgroundStrong: '#0d0814',
  backgroundHover: '#150d1f',
  backgroundPress: '#150d1f',
  backgroundFocus: '#150d1f',
  backgroundTransparent: 'rgba(13,8,20,0)',
  color: '#f3e8ff',
  colorHover: '#e9d5ff',
  colorPress: '#d8b4fe',
  colorFocus: '#e9d5ff',
  colorTransparent: 'rgba(243,232,255,0)',
  borderColor: '#2d1f45',
  borderColorHover: '#4c2d7a',
  borderColorFocus: '#7c3aed',
  borderColorPress: '#7c3aed',
  placeholderColor: '#a78bca',
  color1: '#0d0814',
  color2: '#150d1f',
  color3: '#1e1530',
  color4: '#2d1f45',
  color5: '#3d2860',
  color6: '#4c2d7a',
  color7: '#7c3aed',
  color8: '#a855f7',
  color9: '#c084fc',
  color10: '#d8b4fe',
  color11: '#a78bca',
  color12: '#f3e8ff',
}

const lightTheme = {
  background: '#faf5ff',
  backgroundStrong: '#faf5ff',
  backgroundHover: '#f3e8ff',
  backgroundPress: '#f3e8ff',
  backgroundFocus: '#f3e8ff',
  backgroundTransparent: 'rgba(250,245,255,0)',
  color: '#1e1038',
  colorHover: '#2d1f45',
  colorPress: '#3d2860',
  colorFocus: '#2d1f45',
  colorTransparent: 'rgba(30,16,56,0)',
  borderColor: '#ddd6fe',
  borderColorHover: '#c4b5fd',
  borderColorFocus: '#7c3aed',
  borderColorPress: '#7c3aed',
  placeholderColor: '#6b4fa0',
  color1: '#faf5ff',
  color2: '#f3e8ff',
  color3: '#ffffff',
  color4: '#ddd6fe',
  color5: '#c4b5fd',
  color6: '#a78bca',
  color7: '#7c3aed',
  color8: '#6d28d9',
  color9: '#5b21b6',
  color10: '#4c1d95',
  color11: '#6b4fa0',
  color12: '#1e1038',
}

const conf = createTamagui({
  ...tamaguiConfig,
  tokens,
  themes: {
    dark: darkTheme,
    light: lightTheme,
  },
})

type Conf = typeof conf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default conf
