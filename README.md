# EMS - Event Management System

A scalable, enterprise-grade frontend application built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features

- ✅ **Docker Support** - Production & development containers
- ✅ **Pre-commit Hooks** - Automatic linting before every commit
- ✅ **GitHub Actions** - CI/CD pipeline for automated checks
- ✅ **TypeScript** - Full type safety
- ✅ **ESLint + Prettier** - Consistent code quality
- ✅ **Feature-based Architecture** - Scalable structure
- ✅ **Next.js 16** - Latest features with React Compiler
- ✅ **Internationalization** - Multi-language support (English & French)

## 📄 Pages (6 Total)

### Public Pages
- **Home** - `/` - Landing page
- **About** - `/about` - About page
- **Contact** - `/contact` - Contact page

### Authentication (Route Group)
- **Login** - `/login` - User login
- **Register** - `/register` - User registration

### Dashboard (Route Group)
- **Events** - `/events` - Event management dashboard

> **Note:** All pages support English and French via language switcher button (no locale in URL).

## 🏗️ Architecture

```
src/
├── app/                    # Next.js routes (6 pages)
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Dashboard route group
│   └── ...
├── components/            # Shared components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   └── common/           # Common components
├── features/             # Feature modules
│   └── events/          # Events feature
├── lib/                  # Core utilities
├── types/               # Global TypeScript types
├── hooks/               # Global custom hooks
├── context/             # React Context providers
├── config/              # Configuration
└── styles/              # Global styles
```

## 💻 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.4 | React framework |
| React | 19.2.3 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.1.18 | Styling |
| ESLint | 9.39.2 | Code quality |
| Prettier | 3.8.0 | Formatting |
| Husky | 9.1.7 | Git hooks |
| lint-staged | 16.2.7 | Pre-commit linting |

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check for lint errors
npm run lint:fix         # Fix auto-fixable lint errors
npm run type-check       # Run TypeScript type checking
```

## 🐳 Docker

### Quick Start with Docker

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up
```

### Manual Docker Commands

```bash
# Build production image
docker build -t ems-app .

# Run container
docker run -p 3000:3000 ems-app

# View logs
docker logs ems-app
```

**📖 Docker Documentation:**
- **Quick Start:** [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md) - Essential commands
- **Full Guide:** [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Complete documentation

### Docker Benefits
- ✅ **Consistent environments** across all machines
- ✅ **Production-optimized** builds (~150MB)
- ✅ **Multi-stage builds** for smaller images
- ✅ **Easy deployment** to any server
- ✅ **Isolated development** with hot-reload

## 🔧 Git Workflow

### Automatic Checks

Every commit automatically runs:
- ✅ ESLint on staged files
- ✅ Auto-fixes issues when possible
- ✅ Blocks commit if errors exist

### Making a Commit

```bash
git add .
git commit -m "feat: add new feature"

# Pre-commit hook runs automatically
# - Lints your staged files
# - Fixes issues if possible
# - Allows commit only if no errors
```

### GitHub Actions

On every push/PR:
- ✅ Lint checks
- ✅ TypeScript type checks
- ✅ Build verification

## 🎯 Events Feature

Complete event management system:

**Event Types:**
- Meeting
- Conference
- Workshop
- Webinar
- Other

**Event Status:**
- Upcoming
- Ongoing
- Completed
- Cancelled

**Includes:**
- EventCard component
- useEvents hook
- Full CRUD API
- Type-safe operations

## 🧩 Components

### UI Components (`components/ui/`)
- **Button** - Multiple variants and sizes
- **Input** - Form input with validation
- **Card** - Flexible container
- **Loader** - Loading spinner
- **Modal** - Accessible dialog

### Layout Components (`components/layout/`)
- **Header** - Site header
- **Footer** - Site footer
- **Sidebar** - Navigation sidebar

## 🛠️ Core Infrastructure

- **API Client** - Centralized HTTP client
- **Utilities** - Date, currency, string formatting
- **Validators** - Email, password, phone, URL validation
- **Hooks** - useAuth, useLocalStorage, useDebounce
- **Context** - AuthContext, ThemeContext

## 📚 Documentation

- **[GIT_SETUP.md](./GIT_SETUP.md)** - Complete Git & CI/CD setup guide
- **[DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)** - Docker quick reference
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker setup guide
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Project overview
- **[README.i18n.md](./README.i18n.md)** - Internationalization guide

## 🎨 Import Examples

```tsx
// Components
import Button from "@/components/ui/Button";
import EventCard from "@/features/events/components/EventCard";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/features/events/hooks/useEvents";

// API
import { eventApi } from "@/features/events/api/eventApi";

// Utils
import { formatDate } from "@/lib/utils/format";
```

## 👥 Team Collaboration

### Benefits
- ✅ **Enforced Code Quality** - Pre-commit hooks prevent bad code
- ✅ **Automated CI/CD** - GitHub Actions run on every push
- ✅ **Consistent Standards** - ESLint + Prettier configuration
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Scalable Architecture** - Feature-based organization

### Branch Protection

Recommended GitHub settings:
1. Require status checks to pass
2. Require pull request reviews
3. Require branches to be up to date

## 🌐 Routes

| URL | Description | Group |
|-----|-------------|-------|
| `/` | Home page | Public |
| `/about` | About page | Public |
| `/contact` | Contact page | Public |
| `/login` | Login page | Auth |
| `/register` | Register page | Auth |
| `/events` | Events dashboard | Dashboard |

### 🌍 Internationalization

- **English (en)** - Default language
- **French (fr)** - Secondary language
- **Clean URLs** - No locale prefix in URLs
- **Language detection** - Automatic from cookies and browser settings
- **Language switcher** - Button-based switching on all pages
- **Cookie storage** - User's language preference is saved
- See [README.i18n.md](./README.i18n.md) for detailed i18n documentation

## 🐛 Troubleshooting

### Pre-commit Hook Not Running
```bash
npm run prepare
chmod +x .husky/pre-commit
```

### Lint Errors
```bash
npm run lint:fix
```

### GitHub Actions Failing
```bash
npm run lint
npm run type-check
npm run build
```

## 🔐 CI/CD Pipeline

```
Developer Commits
       ↓
Pre-commit Hook
   └─ ESLint + Auto-fix
       ↓
Push to GitHub
       ↓
GitHub Actions
   ├─ Lint
   ├─ Type Check
   └─ Build
       ↓
Ready to Merge ✅
```

## 🎓 Best Practices

1. **Never bypass pre-commit hooks** (avoid `--no-verify`)
2. **Fix linting errors immediately**
3. **Run tests before pushing**
4. **Use conventional commits** (feat:, fix:, docs:, etc.)
5. **Create small, focused PRs**
6. **Review CI logs when builds fail**

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with** ❤️ **using Next.js 16, React 19, and TypeScript**

**🎯 Status:** Production-Ready  
**👥 Team-Ready:** Yes ✅  
**📊 Code Quality:** Automated ✅  
**🔧 CI/CD:** Configured ✅  
**🐳 Docker:** Ready ✅
