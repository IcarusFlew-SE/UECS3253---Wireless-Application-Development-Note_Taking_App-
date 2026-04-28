# React Native Note-Taking App - NoteNester 📝 @UECS3253 - Wireless Application Development Project

---
## Introduction
NoteNester is a modern, feature-rich note-taking application built with React Native with AVD Emulator. It provides users with a seamless and intuitive platform to capture, organize, and manage their notes efficiently. The application supports CRUD operations, dynamic light/dark mode theme, smooth animated transitions, and various UI customization options.

---
## Features
- **CRUD Operations**: Create, Read, Update, and Delete notes easily
- **Dynamic Light/Dark Mode**: Switch between light and dark mode with a single click
- **Smooth Animated Transitions**: Enjoy smooth animations and transitions
- **UI Customization Options**: Customize the UI to your liking
- **Note Organization**: Organize notes by categories and tags
- **Search Functionality**: Search for notes by title or content
- **Offline Support**: Access notes without an internet connection
- **Cloud Sync** (Future): Sync notes across devices

---
## Prerequisites
- **React Native**: 0.68 or higher
- **Node.js**: 14 or higher
- **Android Studio**: Installed and configured with AVD Emulator

---
## Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/note-taking-app.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd note-taking-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

---
## Usage
1. **Run on Android Emulator**
   ```bash
   npm run android
   ```

2. **Switch between light and dark mode**
   - Open the app
   - Click the theme toggle button in the top-right corner

3. **Create a new note**
   - Click the '+' button in the bottom-right corner
   - Enter the note title and content
   - Click 'Save'

4. **Edit a note**
   - Click on a note to open it
   - Click the edit icon in the top-right corner
   - Make changes and click 'Save'

5. **Delete a note**
   - Click on a note to open it
   - Click the trash icon in the top-right corner
   - Confirm deletion

6. **Search for notes**
   - Click the search icon in the top-right corner
   - Enter the search query
   - Notes will filter automatically

---
## Tech Stack
- **React Native**: Cross-platform mobile framework
- **React Navigation**: Navigation between screens
- **React Native Elements**: UI component library
- **AsyncStorage**: Local data storage
- **React Native Reanimated**: Smooth animations

---
## Project Structure
```
src/
├── assets/              # Images, fonts, and other assets
├── components/          # Reusable UI components
│   ├── NoteCard.tsx      # Component for displaying notes
│   ├── CategoryChip.tsx  # Component for displaying categories
│   ├── ThemeToggle.tsx   # Component for switching themes
│   ├── EmptyState.tsx    # Component for empty state
│   ├── NoteList.tsx      # Component for displaying note list
│   └── SearchBar.tsx     # Component for searching notes
├── constants/           # Constant values and configurations
├── navigation/          # Navigation setup
│   ├── AppNavigator.tsx  # Main navigator
│   └── routes.ts         # Route configurations
├── screens/             # Application screens
│   ├── HomeScreen.tsx    # Home screen with note list
│   ├── NoteScreen.tsx    # Note detail screen
│   ├── AddNoteScreen.tsx # Add new note screen
│   ├── EditNoteScreen.tsx # Edit existing note screen
│   └── SettingsScreen.tsx # App settings screen
├── services/            # Business logic and API services
│   ├── noteService.ts    # Note CRUD operations
│   └── storageService.ts # AsyncStorage operations
├── themes/              # Theme configurations
│   ├── theme.ts          # Main theme configuration
│   ├── ThemeContext.tsx  # Theme context for switching themes
│   └── typography.ts     # Typography settings
└── utils/               # Utility functions

