# BingoSRM - Service Request Management System

A modern, full-featured Service Request Management (SRM) system built with Next.js 16, Material-UI, and TypeScript. BingoSRM provides a comprehensive solution for managing service requests throughout their entire lifecycle.

## ✨ Features

### 🎯 Service Request Management

- **Complete SR Lifecycle**: Request → Receive → Process → Evaluation → Verify → Complete
- **Data Grid View**: Advanced table with sorting, filtering, and pagination using MUI X Data Grid
- **Search & Filter**: Powerful search functionality with form-based filtering
- **Edit Capabilities**: Inline editing for each SR stage

### 👥 User Management

- **User Management**: Complete user administration interface
- **System Manager**: System-level configuration and management
- **Program Management**: Program-level access control
- **Program Authorization**: Fine-grained permission management

### 🌍 Internationalization

- **Multi-language Support**: English (en) and Korean (ko)
- **Dynamic Language Switching**: Change language on-the-fly
- **i18next Integration**: Robust translation management

### 🎨 UI/UX Features

- **Dark/Light Theme**: Toggle between themes with persistence
- **Material-UI Components**: Modern, accessible component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Notification System**: Toast notifications with Notistack
- **Custom Icons**: Lucide React icon library

### 🔐 Authentication

- **Login System**: Secure authentication flow
- **User Profile**: Profile management dialog
- **Protected Routes**: Route-based access control

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bingo-srm
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Tech Stack

### Core

- **Framework**: [Next.js 16](https://nextjs.org) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [Material-UI v7](https://mui.com/) - React component library
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS

### State Management

- **Global State**: [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
- **Stores**: Left navbar, top navbar, notification stack

### Data & Grid

- **Data Grid**: [@mui/x-data-grid](https://mui.com/x/react-data-grid/) - Advanced table component
- **Date Handling**: [Day.js](https://day.js.org/) - Lightweight date library

### Internationalization

- **i18n**: [react-i18next](https://react.i18next.com/) - React internationalization
- **Detection**: i18next-browser-languagedetector - Automatic language detection
- **Backend**: i18next-http-backend - Translation file loading

### UI Components & Utilities

- **Icons**: [Lucide React](https://lucide.dev/) - Modern icon library
- **Notifications**: [Notistack](https://notistack.com/) - Snackbar notification system
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) - Theme switching

### Development

- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Next.js built-in (Turbopack/Webpack)

## 📁 Project Structure

```
bingo-srm/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (Layout)/            # Main application layout
│   │   │   ├── sr/              # Service Request pages
│   │   │   │   ├── request/     # SR Request stage
│   │   │   │   ├── receive/     # SR Receive stage
│   │   │   │   ├── process/     # SR Process stage
│   │   │   │   ├── evaluation/  # SR Evaluation stage
│   │   │   │   ├── verify/      # SR Verification stage
│   │   │   │   └── complete/    # SR Completion stage
│   │   │   └── user/            # User management pages
│   │   └── (LoginLayout)/       # Login layout & pages
│   ├── components/              # React components
│   │   ├── common/              # Shared components
│   │   ├── sidebar/             # Navigation components
│   │   ├── sr/                  # SR-specific components
│   │   ├── theme/               # Theme components
│   │   └── ui/                  # UI components
│   ├── store/                   # Zustand state stores
│   ├── locales/                 # Translation files (en, ko)
│   ├── interface/               # TypeScript interfaces
│   ├── helper/                  # Utility functions
│   ├── data/                    # Mock data
│   └── ts/                      # TypeScript types & enums
├── public/                      # Static assets
└── config files                 # Next.js, TypeScript, ESLint configs
```

## 🎯 Key Components

### Navigation

- **LeftNavbar**: Collapsible sidebar with app groups
- **TopNavbar**: Header with theme toggle, language switcher, and user profile
- **App Groups**: Organized navigation with hierarchical structure

### Service Requests

- **SRDataGrid**: Advanced data grid for displaying SRs
- **SRSearchForm**: Search and filter interface
- **Stage-specific Pages**: Dedicated pages for each SR lifecycle stage

### State Management

- **leftNavbarStore**: Controls sidebar state and expansion
- **topNavbarStore**: Manages top navigation state
- **notiStackStore**: Handles notification queue

## 🌐 Available Routes

### Main Application

- `/` - Dashboard
- `/sr` - Service Request overview
- `/sr/request` - Create new SR
- `/sr/receive` - Receive SRs
- `/sr/process` - Process SRs
- `/sr/evaluation` - Evaluate SRs
- `/sr/verify` - Verify SRs
- `/sr/complete` - Complete SRs

### User Management

- `/user` - User overview
- `/user/user-management` - Manage users
- `/user/system-manager` - System management
- `/user/program` - Program management
- `/user/program-auth` - Program authorization

### Authentication

- `/login` - User login

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

### Theme Customization

Theme configuration is located in `src/app/theme.ts` and `src/components/theme/theme.ts`.

### Localization

Add translations in:

- `src/locales/en/common.json` (English)
- `src/locales/ko/common.json` (Korean)

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 📞 Support

For support, please contact the development team.

---

Built with ❤️ using Next.js and Material-UI
