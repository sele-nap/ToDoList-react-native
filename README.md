# ✨ To Do List

A React Native todo app built with Expo.

## Stack

- **Expo SDK 54** · React 19.1.0 · React Native 0.81.5 · TypeScript 5.9
- **Tamagui 2.0.0-rc.22** — UI components & theming
- **AsyncStorage** — local persistence (no backend)
- **react-native-reanimated 4** · **react-native-gesture-handler 2**
- **react-native-draggable-flatlist** — drag & drop reorder

## Features

- ✅ Add, edit, delete tasks (swipe left to delete)
- 🎯 Priorities: High / Medium / Low
- 📅 Due dates with overdue detection
- 🗂️ Custom categories with emoji & color
- 🔍 Search + filter by status, priority, category
- 🔀 Sort by date, due date, priority, alphabetical
- 📝 Notes & subtasks per task
- 🔁 Recurring tasks (daily / weekly / monthly)
- 📊 Stats modal (completions, priority & category breakdown)
- 🎉 Confetti when all tasks are done
- 🌙 Dark / light theme toggle
- 📳 Haptic feedback

## Getting Started

```bash
npm install --legacy-peer-deps
npx expo start
```

> ⚠️ Always use `--legacy-peer-deps` — react-dom@19.2.4 conflicts with react@19.1.0 (Expo SDK 54 constraint).

Scan the QR code with **Expo Go** (Android / iOS).

## Emulation with Android Studio

1. Download **Android Studio** → [developer.android.com/studio](https://developer.android.com/studio)
   > ⚠️ On Apple Silicon (M1/M2/M3/M4) make sure to download the **"Mac with Apple chip"** version, not the Intel one.

2. Open Android Studio → **More Actions → Virtual Device Manager → Create Device**
   - Choose a phone model (e.g. Pixel 8)
   - Download a system image (API 34+ recommended)
   - Start the AVD

3. With the emulator running and your dev server started, press **`a`** in the Expo terminal to open the app automatically.

```bash
npx expo start
# then press 'a' to open on Android emulator
```

## Notes

- **Notifications** require a development build — `expo-notifications` is not supported in Expo Go SDK 53+.
- All data is stored locally via AsyncStorage (`@todos`, `@categories`, `@preferences`).
