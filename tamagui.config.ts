import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

// ── Witchy Dark Theme (Obsidian & Amethyst) ──────────────────────────────────
const dark = {
  ...config.themes.dark,

  background: '#0d0814',         // obsidian void
  backgroundHover: '#160b2a',
  backgroundPress: '#1e1038',
  backgroundFocus: '#1e1038',
  backgroundStrong: '#07040d',
  backgroundTransparent: 'rgba(13,8,20,0)',

  color: '#f5f3ff',              // moon whisper
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

  // Scale: darkest → lightest
  color1: '#0d0814',   // deep void
  color2: '#160b2a',   // nightshade
  color3: '#1e1038',   // coven
  color4: '#2c1654',   // grimoire
  color5: '#3b1a6e',   // dark amethyst
  color6: '#4c1d95',   // witchfire
  color7: '#6d28d9',   // purple flame
  color8: '#7c3aed',   // primary amethyst
  color9: '#8b5cf6',   // violet
  color10: '#a78bfa',  // soft violet
  color11: '#c084fc',  // lavender glow
  color12: '#f5f3ff',  // moon whisper
}

// ── Light Cottagecore Theme (Lavender Fog & Plum) ────────────────────────────
const light = {
  ...config.themes.light,

  background: '#faf5ff',         // lavender morning
  backgroundHover: '#f3e8ff',
  backgroundPress: '#ede9fe',
  backgroundFocus: '#ede9fe',
  backgroundStrong: '#ffffff',
  backgroundTransparent: 'rgba(250,245,255,0)',

  color: '#1e1038',              // deep plum
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

  // Scale: lightest → darkest (light mode is reversed)
  color1: '#faf5ff',   // lavender morning
  color2: '#f3e8ff',   // violet mist
  color3: '#ede9fe',   // heather bloom
  color4: '#ddd6fe',   // soft lavender
  color5: '#c084fc',   // lavender glow
  color6: '#a855f7',   // lilac
  color7: '#9333ea',   // purple
  color8: '#7c3aed',   // amethyst
  color9: '#6d28d9',   // deep violet
  color10: '#5b21b6',  // indigo plum
  color11: '#4c1d95',  // dark grape
  color12: '#1e1038',  // deep plum
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
