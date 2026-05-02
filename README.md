# React Native Note-Taking App - NoteNester 📝 @UECS3253 - Wireless Application Development Project

---
## Introduction
NoteNester is a modern, feature-rich note-taking application built with React Native with AVD Emulator. It provides users with a seamless and intuitive platform to capture, organize, and manage their notes efficiently. The application supports CRUD operations, dynamic light/dark mode theme, smooth animated transitions, and various UI customization options.
This project is a high-performance, **offline-first** mobile note-taking application built with **React Native 0.73**. It features real-time cloud synchronization, a sophisticated local database architecture, and a modern UI/UX designed for speed and reliability.

---

#### 🏗️ Architecture Overview

The application follows a **Decoupled Service Architecture** with a strong emphasis on data integrity and availability.

-   **Persistence Layer**: Utilizing `react-native-sqlite-storage` for local relational data management. This ensures the app is fully functional without an internet connection.
-   **Synchronization Layer**: A custom-built **WebSocket Sync Engine** powered by `Socket.IO`. It implements a bi-directional sync strategy with a "last-write-wins" conflict resolution protocol based on microsecond timestamps.
-   **Service Layer**: Business logic is encapsulated in singleton services (`NoteService`, `CloudSyncService`, `AuthService`), keeping components thin and focused on presentation.
-   **UI Layer**: Leveraging `@shopify/flash-list` for O(1) list rendering performance and `react-native-reanimated` for 60fps fluid transitions.

---

#### 🛠️ Technical Stack

**Frontend (Mobile)**
-   **Framework**: React Native 0.73 (TypeScript)
-   **State Management**: React Hooks & Context API for lightweight, reactive state.
-   **Navigation**: React Navigation 6.x (Stack, Drawer, and Bottom Tabs).
-   **Database**: SQLite (Local) + Socket.IO-client (Sync).
-   **Styling**: Custom theme engine with Dark Mode support and dynamic color injection.
-   **Icons**: Lucide React Native & Vector Icons.

**Backend (Sync Server)**
-   **Runtime**: Node.js 18+
-   **Framework**: Express.js
-   **Communication**: Socket.IO (WebSockets) for real-time events.
-   **Persistence**: JSON-based flat-file storage for simplified deployment and low-latency access.

---

#### 📊 Database Schema

The local SQLite database (`notenest.db`) is structured to support complex archival and trash workflows:

| Table | Fields | Description |
| :--- | :--- | :--- |
| **`notes`** | `id (PK)`, `title`, `body`, `category_id`, `color`, `isPinned`, `lastUpdated`, `isSynced`, `is_deleted`, `is_archived`, `deleted_at`, `archived_at` | Primary storage for note content and metadata. |
| **`categories`** | `id (PK)`, `name`, `color` | User-defined tags for organizational hierarchy. |

---

#### 🔄 Sync Logic & WebSocket Protocol

The synchronization engine operates on a reactive event model:

1.  **Join**: Client authenticates and joins a unique `user:${userId}` room.
2.  **Push (Local → Cloud)**: Client identifies dirty records (`isSynced = 0`) and emits `syncLocalToCloud`.
3.  **Pull (Cloud → Local)**: Client requests state delta via `syncCloudToLocal`.
4.  **Real-time Broadcast**: When changes occur on one device, the server broadcasts `note:updated` or `note:created` to all other active sessions for that user.

**Key Events:**
-   `note:create` / `note:update`: Atomic operations for single note changes.
-   `note:archive` / `note:delete`: Specialized events for state transitions (Trash/Archive).
-   `syncAll`: A composite operation ensuring local and remote states are identical.

---

#### 🚀 Getting Started

**Prerequisites:**
-   Node.js >= 18
-   React Native CLI
-   Android Studio

**1. Server Setup**
```bash
# From project root
npm run server
```
*Note: The server runs on port 8080 by default. Ensure `10.0.2.2` (Android Emulator) or your local IP is configured in `CloudService.js`.*

**2. Client Setup**
```bash
# Clone the repository
git clone https://github.com/IcarusFlew-SE/UECS3253---Wireless-Application-Development-Note_Taking_App-.git

# Install dependencies
npm install

# Start Metro Bundler
npx react-native start

# Run on Android
npx react-native run-android
```

---

#### 🧪 Quality & Optimization
-   **FlashList Integration**: Replaces standard `FlatList` to reduce memory footprint and eliminate blank items during fast scrolls.
-   **Atomic Writes**: Database transactions ensure that note saves and sync-state updates are atomic.
-   **Connectivity Awareness**: Uses `@react-native-community/netinfo` to queue sync operations until a stable connection is established.

---
## Usage
1. **Switch between light and dark mode**
   - Open the app
   - Click the theme toggle button in the top-right corner

2. **Create a new note**
   - Click the '+' button in the bottom-right corner
   - Enter the note title and content
   - Click 'Save'

3. **Edit a note**
   - Click on a note to open it
   - Click the edit icon in the top-right corner
   - Make changes and click 'Save'

4. **Delete a note**
   - Click on a note to open it
   - Click the trash icon in the top-right corner
   - Confirm deletion

5. **Search for notes**
   - Click the search icon in the top-right corner
   - Enter the search query
   - Notes will filter automatically

---
## Project Structure
```
src/
├── assets/              # Images, fonts, and other assets
├── components/          # Reusable UI components
│   ├── NoteCard.tsx      # Component for displaying notes
│   ├── CategoryChip.tsx  # Component for displaying categories
|   |── FAB.tsx           # Component for floating action button
|   |── LoadingSkeleton.tsx # Component for loading skeleton
|   |── InputField.tsx    # Component for input field
│   ├── ThemeToggle.tsx   # Component for switching themes
│   ├── EmptyState.tsx    # Component for empty state
│   └── SearchBar.tsx     # Component for searching notes
├── database/              
│   └── db.js             # Database operations
├── navigation/          # Navigation setup
│   └── AppNavigator.tsx  # Main navigator
├── screens/             # Application screens
│   ├── HomeScreen.tsx    # Home screen with note list
│   ├── ArchivedScreen.tsx # Archived notes screen
│   ├── TrashScreen.tsx   # Trashed notes screen
│   ├── EditorScreen.tsx  # Edit note screen
│   └── CloudSyncScreen.tsx # Cloud sync screen
├── services/            # Business logic and API services
│   ├── NoteService.js    # Note CRUD operations
│   ├── CloudSyncService.js # Cloud sync operations
│   ├── SettingsService.js # Settings operations
│   ├── AuthService.js    # Authentication operations
├── themes/              # Theme configurations
│   ├── theme.ts          # Main theme configuration
│   └── ThemeContext.tsx  # Theme context for switching themes
```