import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

const dark = {
  ...config.themes.dark,

  background: '#0d0814',
  backgroundHover: '#160b2a',
  backgroundPress: '#1e1038',
  backgroundFocus: '#1e1038',
  backgroundStrong: '#07040d',
  backgroundTransparent: 'rgba(13,8,20,0)',

  color: '#f5f3ff',
  colorHover: '#ede9fe',
  colorPress: '#ddd6fe',
  colorFocus: '#ddd6fe',
  colorTransparent: 'rgba(245,243,255,0)',

  shadowColor: 'rgba(124,58,237,0.4)',
  shadowColorHover: 'rgba(124,58,237,0.6)',

  borderColor: '#3b1a6e',
  borderColorHover: '#5b21b6',
  borderColorFocus: '#7c3aed',
  borderColorPress: '#7c3aed',

  placeholderColor: '#6b5080',

  color1: '#0d0814',
  color2: '#160b2a',
  color3: '#1e1038',
  color4: '#2c1654',
  color5: '#3b1a6e',
  color6: '#4c1d95',
  color7: '#6d28d9',
  color8: '#7c3aed',
  color9: '#8b5cf6',
  color10: '#a78bfa',
  color11: '#c084fc',
  color12: '#f5f3ff',
}

const light = {
  ...config.themes.light,

  background: '#faf5ff',
  backgroundHover: '#f3e8ff',
  backgroundPress: '#ede9fe',
  backgroundFocus: '#ede9fe',
  backgroundStrong: '#ffffff',
  backgroundTransparent: 'rgba(250,245,255,0)',

  color: '#1e1038',
  colorHover: '#2c1654',
  colorPress: '#3b1a6e',
  colorFocus: '#3b1a6e',
  colorTransparent: 'rgba(30,16,56,0)',

  shadowColor: 'rgba(124,58,237,0.12)',
  shadowColorHover: 'rgba(124,58,237,0.2)',

  borderColor: '#d8b4fe',
  borderColorHover: '#a855f7',
  borderColorFocus: '#7c3aed',
  borderColorPress: '#7c3aed',

  placeholderColor: '#9872b8',

  color1: '#faf5ff',
  color2: '#f3e8ff',
  color3: '#ede9fe',
  color4: '#ddd6fe',
  color5: '#c084fc',
  color6: '#a855f7',
  color7: '#9333ea',
  color8: '#7c3aed',
  color9: '#6d28d9',
  color10: '#5b21b6',
  color11: '#4c1d95',
  color12: '#1e1038',
}

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    dark,
    light,
  },
})

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig
