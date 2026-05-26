# 🐄 Oliyad, Aklilu & Friends — Cattle Fattening and Dairy Management System

> **ኦሊያድ፣ አቅሊሉ እና ጓደኞቻቸው የከብት ማድለብ እና የወተት ምርት አስተዳደር ስርዓት**

A professional, full-stack farm management platform built for **Oliyad, Aklilu and Friends** cattle fattening and dairy business in Ethiopia. The entire application is bilingual — **English and Amharic (አማርኛ)** — throughout every page.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?logo=prisma)](https://www.prisma.io/)

---

## 🌿 Overview / አጠቃላይ እይታ

This platform provides complete digital management for every aspect of the farm:

- 🐄 **Cattle Inventory** — Register and track individual cattle with full health & weight history
- 🥛 **Dairy Production** — Session-based milk yield recording with quality metrics
- 🌾 **Feeding Management** — Log daily feed per cattle, track costs, monitor stock levels
- 💰 **Sales & Invoicing** — Professional invoices for cattle, milk, and dairy product sales
- 👥 **Employee Payroll** — Manage farm workers and process monthly payroll
- 📊 **Reports & Analytics** — Weight gain trends, revenue, feeding costs, milk production charts
- 🏥 **Health Records** — Veterinary visits, vaccinations, and treatment tracking
- 🔐 **Role-Based Access** — Admin, Manager, and Worker roles

---

## 🖥️ Live Demo / ቀጥታ ስርዓት

| Service | URL |
|---------|-----|
| 🌐 Frontend | [https://oliyad-aklilu-cattle-dairy.vercel.app](https://oliyad-aklilu-cattle-dairy.vercel.app) |
| ⚙️ Backend API | [https://oliyad-aklilu-cattle-dairy-api.vercel.app](https://oliyad-aklilu-cattle-dairy-api.vercel.app) |

**Demo Credentials / የሙከራ መረጃ:**
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@olyiadcattle.com` | `Admin@2024!` |
| Manager | `manager@olyiadcattle.com` | `Manager@2024!` |

---

## 🛠️ Tech Stack / ቴክኖሎጂ

### Frontend
| Tool | Purpose |
|------|---------|
| **Next.js 16** | React framework with App Router |
| **Tailwind CSS v4** | Utility-first styling with CSS-based config |
| **Recharts** | Interactive charts and analytics |
| **Zustand** | Lightweight state management |
| **TanStack Query** | Server state, caching, and refetching |
| **React Hot Toast** | Elegant notifications |
| **Lucide React** | Icon library |
| **Noto Sans Ethiopic** | Amharic font support |

### Backend
| Tool | Purpose |
|------|---------|
| **Node.js + Express** | REST API server |
| **TypeScript** | Type-safe backend |
| **Prisma ORM** | Database access and migrations |
| **PostgreSQL** | Primary relational database |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing (cost 12) |
| **Helmet + Rate Limiter** | API security |

---

## 🌍 Bilingual Support / ሁለት ቋንቋ ድጋፍ

Every page, label, button, and message in the app is written in both **English** and **Amharic (አማርኛ)**. The Amharic font (*Noto Sans Ethiopic*) is loaded globally and applied via `.font-amharic` class.

---

## 📁 Project Structure / የፕሮጀክት መዋቅር

```
Oliyad_Aklilu_Cattle_Dairy/
├── frontend/                  # Next.js 16 App
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Landing page
│       │   ├── login/             # Auth pages
│       │   ├── dashboard/         # Main dashboard
│       │   ├── cattle/            # Cattle management
│       │   ├── feeding/           # Feed & feeding logs
│       │   ├── dairy/             # Milk production
│       │   ├── sales/             # Sales & invoices
│       │   ├── employees/         # Staff & payroll
│       │   ├── reports/           # Analytics
│       │   └── settings/          # User profile
│       ├── components/            # Shared UI components
│       ├── store/                 # Zustand auth store
│       └── lib/                   # Axios API client
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── middleware/        # Auth & error middleware
│   │   └── utils/             # Prisma client
│   └── prisma/
│       ├── schema.prisma      # Database schema
│       └── seed.ts            # Demo seed data
│
└── package.json               # Root — runs both concurrently
```

---

## 🚀 Local Setup / ሀገር ውስጥ ማዋቀር

### Prerequisites
- Node.js 20+
- PostgreSQL 14+

### 1. Clone the repo
```bash
git clone https://github.com/Esraprojects/oliyad-aklilu-cattle-dairy.git
cd oliyad-aklilu-cattle-dairy
```

### 2. Install dependencies
```bash
npm run install:all
```

### 3. Set up backend environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL connection string
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cattle_dairy_db"
JWT_SECRET="your-secret-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### 4. Set up frontend environment
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > frontend/.env.local
```

### 5. Migrate & seed database
```bash
cd backend
npx prisma db push
npx ts-node prisma/seed.ts
```

### 6. Start development servers
```bash
cd ..
npm run dev
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
```

---

## 🌐 Deployment / ማሰማራት

| Service | Platform |
|---------|---------|
| Frontend | [Vercel](https://vercel.com) |
| Backend + Database | [Railway](https://railway.app) |

---

## 📊 Database Schema Highlights

- `Cattle` — Individual animal records with weight, health, feeding history
- `MilkRecord` — Per-session milk yield with fat/protein content
- `FeedingLog` — Feed consumption per animal with cost tracking
- `Sale` + `SaleItem` — Invoice-based sales for cattle and dairy products
- `Employee` + `Payroll` — Staff management with monthly payroll
- `HealthRecord` — Veterinary treatments and vaccination records

---

## 🎨 Design Theme / ዲዛይን

| Color | Hex | Usage |
|-------|-----|-------|
| 🌲 Forest Green | `#1B4332` | Primary — sidebar, buttons |
| 🌿 Sage | `#40916C` | Secondary — accents |
| 🌱 Mint | `#D8F3DC` | Light backgrounds |
| 🪵 Earth | `#8B5E3C` | Earth tones |
| 🧡 Amber | `#F4A261` | Dairy accent, CTAs |

---

## 👨‍💼 Business / ንግድ

**Oliyad, Aklilu and Friends Cattle Fattening and Dairy**  
**ኦሊያድ፣ አቅሊሉ እና ጓደኞቻቸው የከብት ማድለብ እና የወተት ምርት**  
📍 Addis Ababa, Ethiopia / አዲስ አበባ፣ ኢትዮጵያ

---

*Built with ❤️ for Ethiopian farmers / ለኢትዮጵያ አርሶ አደሮች በፍቅር የተሰራ*
