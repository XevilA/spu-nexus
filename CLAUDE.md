# CLAUDE.md - AI Assistant Guide for SPU Nexus

**Last Updated:** November 26, 2025
**Project:** SPU Smart (University to Business Platform)
**Repository:** spu-nexus

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Patterns](#architecture--patterns)
3. [Directory Structure](#directory-structure)
4. [Technology Stack](#technology-stack)
5. [Development Workflows](#development-workflows)
6. [Code Conventions](#code-conventions)
7. [Common Patterns & Tasks](#common-patterns--tasks)
8. [Database Schema](#database-schema)
9. [Authentication & Authorization](#authentication--authorization)
10. [Important Considerations](#important-considerations)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What is SPU Smart?

SPU Smart is a **University to Business (U2B) platform** that connects students from Sripatum University (SPU) with employers. It provides:

- **Multi-role system** (Students, Employers, Admins)
- **Job marketplace** with application tracking
- **E-Portfolio system** with faculty approval workflow
- **AI-powered features** (job recommendations, portfolio improvements)
- **News & Activities** content management
- **Real-time notifications** and messaging

### Project Type

- **Single-Page Application (SPA)** built with React 18
- **Backend-as-a-Service (BaaS)** using Supabase
- **AI Integration** via Google Gemini 1.5 Flash
- **Deployed on** Lovable.dev platform

### Key Metrics

- **85+ TypeScript files**
- **50+ shadcn/ui components**
- **19 page components**
- **27 database tables**
- **18 database migrations**
- **7 custom feature components**

---

## Architecture & Patterns

### Application Architecture

```
┌─────────────────────────────────────────┐
│         React 18 (SPA)                  │
│  ┌────────────────────────────────┐    │
│  │   React Router v6 (Routing)    │    │
│  │  ┌──────────────────────────┐  │    │
│  │  │  AuthProvider (Context)  │  │    │
│  │  │ ┌──────────────────────┐ │  │    │
│  │  │ │ QueryClient (Cache)  │ │  │    │
│  │  │ │  ┌────────────────┐  │ │  │    │
│  │  │ │  │  Page Components │ │ │  │    │
│  │  │ │  └────────────────┘  │ │  │    │
│  │  │ └──────────────────────┘ │  │    │
│  │  └──────────────────────────┘  │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
            ↕ REST + Realtime
┌─────────────────────────────────────────┐
│    Supabase Backend                     │
│  - PostgreSQL Database                  │
│  - Row-Level Security (RLS)             │
│  - Edge Functions (Deno)                │
│  - Authentication Service               │
│  - Storage (future)                     │
└─────────────────────────────────────────┘
            ↕ API Calls
┌─────────────────────────────────────────┐
│    External Services                    │
│  - Google Gemini AI (via Edge Function)│
│  - Google OAuth (spu.ac.th domain)     │
└─────────────────────────────────────────┘
```

### Design Patterns Used

1. **Provider Pattern** - Auth, Query, Theme contexts
2. **Component Composition** - Atomic design with shadcn/ui
3. **Compound Components** - Card, Dialog, Form components
4. **Custom Hooks** - useAuth, useToast, useIsMobile
5. **Controlled Components** - Forms with react-hook-form
6. **Singleton Pattern** - Supabase client instance
7. **Factory Pattern** - Edge function handlers

### State Management Strategy

```
┌──────────────────────────────────┐
│  React Query (Server State)      │
│  - Data fetching & caching       │
│  - Automatic refetching          │
│  - Optimistic updates            │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  Context API (Global State)      │
│  - Authentication (user/session) │
│  - Profile data                  │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  useState (Local State)          │
│  - UI state (modals, loading)    │
│  - Form data (temporary)         │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│  react-hook-form (Form State)    │
│  - Form validation               │
│  - Field-level state             │
└──────────────────────────────────┘
```

---

## Directory Structure

```
/home/user/spu-nexus/
│
├── src/
│   ├── components/              # React components
│   │   ├── ui/                  # 50+ shadcn/ui components
│   │   │   ├── button.tsx       # Button component
│   │   │   ├── card.tsx         # Card layout
│   │   │   ├── dialog.tsx       # Modal dialogs
│   │   │   ├── form.tsx         # Form components
│   │   │   ├── table.tsx        # Data tables
│   │   │   └── ...              # 45+ more components
│   │   │
│   │   ├── AIAssistant.tsx      # AI chat interface (6,300 lines)
│   │   ├── AIPopup.tsx          # AI modal dialog (9,996 lines)
│   │   ├── ChatSystem.tsx       # User messaging (8,742 lines)
│   │   ├── JobPostForm.tsx      # Job posting UI (10,927 lines)
│   │   ├── NotificationCenter.tsx # Notifications (11,379 lines)
│   │   ├── PortfolioViewer.tsx  # Portfolio display (16,542 lines)
│   │   └── TestAI.tsx           # AI testing tool (2,730 lines)
│   │
│   ├── pages/                   # Page components (19 files)
│   │   ├── Index.tsx            # Home page
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Auth.tsx             # User authentication
│   │   ├── AdminAuth.tsx        # Admin login
│   │   ├── AdminDashboard.tsx   # Admin panel
│   │   ├── BusinessAuth.tsx     # Business login
│   │   ├── BusinessRegistration.tsx # Business signup
│   │   ├── BusinessDashboard.tsx # Business panel
│   │   ├── EmployerDashboard.tsx # Employer panel
│   │   ├── JobSeekerDashboard.tsx # Job seeker panel
│   │   ├── StudentDashboard.tsx # Student panel
│   │   ├── JobListings.tsx      # Job search
│   │   ├── JobAcceptance.tsx    # Job offers
│   │   ├── PortfolioBuilder.tsx # Portfolio editor
│   │   ├── ImprovedNews.tsx     # News/blog feed
│   │   ├── ImprovedActivities.tsx # Events feed
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.tsx          # Authentication context & hooks
│   │   ├── use-toast.ts         # Toast notification hook
│   │   └── use-mobile.tsx       # Mobile detection hook
│   │
│   ├── integrations/            # Third-party integrations
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client singleton
│   │       └── types.ts         # Auto-generated DB types (12,896 lines)
│   │
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # cn() class merger
│   │
│   ├── App.tsx                  # Main app with routing
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles + CSS variables
│   └── vite-env.d.ts            # TypeScript environment types
│
├── supabase/                    # Backend configuration
│   ├── functions/               # Edge functions (Deno)
│   │   └── spu-smart-ai/
│   │       └── index.ts         # Gemini AI integration
│   │
│   ├── migrations/              # Database migrations (18 files)
│   │   ├── 20250916173231_*.sql # Initial schema
│   │   ├── 20250917141728_*.sql # Schema updates
│   │   └── ...                  # More migrations
│   │
│   └── config.toml              # Supabase project config
│
├── public/                      # Static assets
│   ├── favicon.ico              # Site icon
│   ├── placeholder.svg          # Placeholder images
│   └── robots.txt               # SEO crawling rules
│
├── Configuration Files
├── components.json              # shadcn/ui config
├── eslint.config.js             # ESLint 9 flat config
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── postcss.config.js            # PostCSS + Tailwind
├── tailwind.config.ts           # Tailwind theme (SPU pink)
├── tsconfig.json                # TypeScript root config
├── tsconfig.app.json            # App compilation config
├── tsconfig.node.json           # Node/build config
├── vite.config.ts               # Vite bundler config
├── .gitignore                   # Git ignore rules
├── .env                         # Environment variables
├── README.md                    # Project documentation
└── CLAUDE.md                    # This file (AI assistant guide)
```

### File Size Guidelines

**Large Components (>5,000 lines):**
- When editing, read the full file first to understand context
- Use targeted edits rather than full rewrites
- Break into smaller components if adding significant new features

**Key Files to Understand:**
- `src/integrations/supabase/types.ts` - Auto-generated, don't edit manually
- `src/hooks/useAuth.tsx` - Central auth logic
- `src/App.tsx` - Routing and providers

---

## Technology Stack

### Frontend Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.19 | Build tool & dev server |
| **React Router** | 6.30.1 | Client-side routing |
| **React Query** | 5.83.0 | Server state management |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Latest | Unstyled primitives |
| **Lucide React** | 0.462.0 | Icon library |
| **next-themes** | 0.3.0 | Dark mode support |

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **react-hook-form** | 7.61.1 | Form state management |
| **Zod** | 3.25.76 | Schema validation |
| **@hookform/resolvers** | 3.10.0 | Form-Zod integration |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.57.4 | Backend-as-a-Service |
| **PostgreSQL** | (via Supabase) | Relational database |
| **Deno** | (via Supabase) | Edge function runtime |

### AI & External Services

| Technology | Purpose |
|------------|---------|
| **Google Gemini 1.5 Flash** | AI recommendations & chat |
| **Google OAuth** | Authentication (spu.ac.th) |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.32.0 | Code linting |
| **TypeScript ESLint** | 8.38.0 | TypeScript linting |
| **Lovable Tagger** | 1.1.9 | Component tagging (dev) |

---

## Development Workflows

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd spu-nexus

# Install dependencies
npm install

# Start development server (port 8080)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Setup

**Required Environment Variables (.env):**

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development Server

- **URL:** http://localhost:8080
- **Hot Module Replacement (HMR):** Enabled
- **Compiler:** SWC (faster than Babel)

### Branch Strategy

- **Main Branch:** Production-ready code
- **Feature Branches:** `claude/feature-name-*` or descriptive names
- **AI Development:** Use provided branch `claude/claude-md-mig9698htzmdhowl-01Px9udQUoCCf9xZhE1TxUpr`

### Commit Guidelines

```bash
# Good commit messages
git commit -m "Add job filtering by location"
git commit -m "Fix: Portfolio approval notification not sending"
git commit -m "Update: AI chat UI with better error handling"
git commit -m "Refactor: Extract job card component"

# Commit and push workflow
git add .
git commit -m "Descriptive message"
git push -u origin branch-name
```

### Adding New Dependencies

```bash
# Install package
npm install package-name

# Install dev dependency
npm install -D package-name

# Install shadcn/ui component
npx shadcn@latest add component-name
```

### Database Migrations

```bash
# Migrations are in supabase/migrations/
# Format: YYYYMMDDHHMMSS_uuid.sql

# To apply migrations in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Copy migration SQL
# 3. Execute

# Note: Local Supabase CLI not required for this project
```

---

## Code Conventions

### TypeScript Guidelines

1. **Type Safety:**
   ```typescript
   // Use imported Supabase types
   import type { Database, Tables } from "@/integrations/supabase/types";

   type Job = Tables<"jobs">;
   type JobInsert = TablesInsert<"jobs">;
   ```

2. **Strict Mode:**
   - Currently **disabled** in tsconfig
   - When adding code, strive for type safety even without strict mode
   - Avoid `any` types where possible

3. **Interface vs Type:**
   ```typescript
   // Prefer type for unions and primitives
   type Status = "DRAFT" | "SUBMITTED" | "APPROVED";

   // Use interface for objects
   interface UserProfile {
     id: string;
     email: string;
     role: "student" | "employer" | "admin";
   }
   ```

### Component Conventions

1. **File Naming:**
   - Components: `PascalCase.tsx` (e.g., `JobCard.tsx`)
   - Utilities: `kebab-case.ts` (e.g., `use-toast.ts`)
   - Pages: `PascalCase.tsx` (e.g., `StudentDashboard.tsx`)

2. **Component Structure:**
   ```typescript
   import { useState } from "react";
   import { ComponentProps } from "./types";
   import { Button } from "@/components/ui/button";

   export function MyComponent({ prop1, prop2 }: ComponentProps) {
     const [state, setState] = useState();

     const handleAction = () => {
       // Logic here
     };

     return (
       <div className="container">
         {/* JSX */}
       </div>
     );
   }
   ```

3. **Import Order:**
   ```typescript
   // 1. React/external libraries
   import { useState, useEffect } from "react";
   import { useNavigate } from "react-router-dom";

   // 2. UI components
   import { Button } from "@/components/ui/button";
   import { Card } from "@/components/ui/card";

   // 3. Custom components
   import { JobCard } from "@/components/JobCard";

   // 4. Hooks
   import { useAuth } from "@/hooks/useAuth";

   // 5. Utilities & types
   import { cn } from "@/lib/utils";
   import type { Database } from "@/integrations/supabase/types";

   // 6. Supabase client
   import { supabase } from "@/integrations/supabase/client";
   ```

### Styling Conventions

1. **Tailwind Usage:**
   ```typescript
   // Use cn() for conditional classes
   import { cn } from "@/lib/utils";

   <div className={cn(
     "base-classes",
     isActive && "active-classes",
     variant === "primary" && "primary-classes"
   )} />
   ```

2. **Theme Colors:**
   ```typescript
   // Primary: Deep Pink (SPU brand color)
   className="bg-primary text-primary-foreground"

   // Use semantic colors
   className="bg-background text-foreground"
   className="bg-card text-card-foreground"
   className="bg-muted text-muted-foreground"

   // Avoid hardcoded colors
   // ❌ className="bg-pink-600"
   // ✅ className="bg-primary"
   ```

3. **Responsive Design:**
   ```typescript
   // Mobile-first approach
   className="p-4 md:p-6 lg:p-8"
   className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

   // Breakpoints
   // sm: 640px
   // md: 768px (mobile detection threshold)
   // lg: 1024px
   // xl: 1280px
   // 2xl: 1536px
   ```

### Error Handling

1. **Supabase Queries:**
   ```typescript
   const { data, error } = await supabase
     .from("jobs")
     .select("*");

   if (error) {
     console.error("Failed to fetch jobs:", error);
     toast({
       title: "Error",
       description: error.message,
       variant: "destructive",
     });
     return;
   }
   ```

2. **Try-Catch for Async Operations:**
   ```typescript
   try {
     const response = await someAsyncOperation();
     toast({
       title: "Success",
       description: "Operation completed",
     });
   } catch (error) {
     console.error("Operation failed:", error);
     toast({
       title: "Error",
       description: error instanceof Error ? error.message : "Unknown error",
       variant: "destructive",
     });
   }
   ```

### Form Handling

1. **react-hook-form with Zod:**
   ```typescript
   import { useForm } from "react-hook-form";
   import { zodResolver } from "@hookform/resolvers/zod";
   import * as z from "zod";

   const formSchema = z.object({
     email: z.string().email(),
     password: z.string().min(6),
   });

   type FormData = z.infer<typeof formSchema>;

   function MyForm() {
     const form = useForm<FormData>({
       resolver: zodResolver(formSchema),
       defaultValues: {
         email: "",
         password: "",
       },
     });

     const onSubmit = async (data: FormData) => {
       // Handle submission
     };

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
           {/* Form fields */}
         </form>
       </Form>
     );
   }
   ```

---

## Common Patterns & Tasks

### Authentication Patterns

1. **Check Authentication Status:**
   ```typescript
   import { useAuth } from "@/hooks/useAuth";

   function ProtectedComponent() {
     const { user, loading, profile } = useAuth();

     if (loading) {
       return <div>Loading...</div>;
     }

     if (!user) {
       return <Navigate to="/auth" />;
     }

     return <div>Protected content</div>;
   }
   ```

2. **Sign In/Out:**
   ```typescript
   const { signInWithEmail, signOut } = useAuth();

   // Sign in
   await signInWithEmail(email, password);

   // Sign out
   await signOut();
   ```

3. **Role-Based Rendering:**
   ```typescript
   const { profile } = useAuth();

   {profile?.role === "admin" && (
     <AdminPanel />
   )}

   {profile?.role === "student" && (
     <StudentFeatures />
   )}
   ```

### Data Fetching Patterns

1. **Simple Query:**
   ```typescript
   const [jobs, setJobs] = useState<Job[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     async function fetchJobs() {
       const { data, error } = await supabase
         .from("jobs")
         .select("*")
         .eq("status", "OPEN")
         .order("created_at", { ascending: false });

       if (error) {
         console.error(error);
       } else {
         setJobs(data || []);
       }
       setLoading(false);
     }

     fetchJobs();
   }, []);
   ```

2. **With React Query:**
   ```typescript
   import { useQuery } from "@tanstack/react-query";

   function useJobs() {
     return useQuery({
       queryKey: ["jobs"],
       queryFn: async () => {
         const { data, error } = await supabase
           .from("jobs")
           .select("*");

         if (error) throw error;
         return data;
       },
     });
   }

   // Usage
   const { data: jobs, isLoading, error } = useJobs();
   ```

3. **With Joins:**
   ```typescript
   const { data } = await supabase
     .from("applications")
     .select(`
       *,
       jobs (*),
       profiles (*)
     `)
     .eq("applicant_id", userId);
   ```

### Mutation Patterns

1. **Insert Data:**
   ```typescript
   const { data, error } = await supabase
     .from("jobs")
     .insert({
       title: "Software Engineer",
       company_id: companyId,
       status: "OPEN",
     })
     .select()
     .single();
   ```

2. **Update Data:**
   ```typescript
   const { error } = await supabase
     .from("applications")
     .update({ status: "ACCEPTED" })
     .eq("id", applicationId);
   ```

3. **Delete Data:**
   ```typescript
   const { error } = await supabase
     .from("jobs")
     .delete()
     .eq("id", jobId);
   ```

### UI Patterns

1. **Loading States:**
   ```typescript
   import { Skeleton } from "@/components/ui/skeleton";

   {loading ? (
     <Skeleton className="h-12 w-full" />
   ) : (
     <ActualContent />
   )}
   ```

2. **Empty States:**
   ```typescript
   {jobs.length === 0 ? (
     <div className="text-center py-12">
       <p className="text-muted-foreground">No jobs found</p>
     </div>
   ) : (
     <JobList jobs={jobs} />
   )}
   ```

3. **Toast Notifications:**
   ```typescript
   import { useToast } from "@/hooks/use-toast";

   const { toast } = useToast();

   toast({
     title: "Success",
     description: "Job posted successfully",
   });

   toast({
     title: "Error",
     description: "Failed to post job",
     variant: "destructive",
   });
   ```

4. **Dialogs/Modals:**
   ```typescript
   import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

   const [open, setOpen] = useState(false);

   <Dialog open={open} onOpenChange={setOpen}>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Dialog Title</DialogTitle>
       </DialogHeader>
       {/* Content */}
     </DialogContent>
   </Dialog>
   ```

### Routing Patterns

1. **Navigation:**
   ```typescript
   import { useNavigate } from "react-router-dom";

   const navigate = useNavigate();

   navigate("/jobs");
   navigate("/portfolio", { state: { portfolioId } });
   navigate(-1); // Go back
   ```

2. **Route Parameters:**
   ```typescript
   import { useParams } from "react-router-dom";

   const { id } = useParams<{ id: string }>();
   ```

3. **Query Parameters:**
   ```typescript
   import { useSearchParams } from "react-router-dom";

   const [searchParams, setSearchParams] = useSearchParams();
   const jobType = searchParams.get("type");
   ```

### AI Integration Pattern

1. **Calling AI Edge Function:**
   ```typescript
   const { data, error } = await supabase.functions.invoke("spu-smart-ai", {
     body: {
       action: "recommend_jobs",
       user_id: userId,
       portfolio_id: portfolioId,
     },
   });
   ```

---

## Database Schema

### Core Tables Overview

#### User & Profile Tables

**profiles**
- Primary user profile table
- Columns: `id`, `email`, `role`, `first_name`, `last_name`, `created_at`, `updated_at`
- Role types: `student`, `employer`, `admin`

**job_seekers**
- Extended profile for job seekers/students
- Columns: `id`, `user_id`, `phone`, `location`, `bio`, `skills`, `experience_years`, `education_level`

**employers**
- Employer-specific information
- Columns: `id`, `user_id`, `company_id`, `position`, `phone`

**companies**
- Company information
- Columns: `id`, `name`, `description`, `industry`, `size`, `website`, `logo_url`, `location`

#### Job & Application Tables

**jobs**
- Job postings
- Columns: `id`, `company_id`, `title`, `description`, `requirements`, `salary_range`, `location`, `job_type`, `status`, `deadline`
- Job types: `Full-time`, `Part-time`, `Internship`, `Freelance`
- Status: `DRAFT`, `OPEN`, `CLOSED`, `FILLED`

**applications**
- Job applications with tracking
- Columns: `id`, `job_id`, `applicant_id`, `status`, `cover_letter`, `resume_url`, `applied_at`
- Status: `PENDING`, `REVIEWING`, `INTERVIEW`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`

**application_messages**
- Chat between applicants and employers
- Columns: `id`, `application_id`, `sender_id`, `message`, `created_at`

#### Portfolio Tables

**portfolios**
- Student e-portfolios with approval workflow
- Columns: `id`, `user_id`, `title`, `summary`, `status`, `version`, `submitted_at`, `approved_at`, `approved_by`
- Status: `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`

**portfolio_sections** (if exists)
- Different sections within a portfolio
- Types: Education, Work Experience, Projects, Skills, Certificates, Languages

#### Content Tables

**blog_posts / news**
- News and blog content
- Columns: `id`, `title`, `content`, `author_id`, `status`, `published_at`, `category_id`

**activities**
- Events and activities
- Columns: `id`, `title`, `description`, `start_date`, `end_date`, `location`, `capacity`, `registered_count`, `status`

**blog_categories**
- Content categorization
- Columns: `id`, `name`, `slug`, `description`

#### System Tables

**admin_whitelist**
- Email whitelist for admin access
- Columns: `id`, `email`, `active`, `created_at`

**ai_usage_logs**
- AI feature usage tracking
- Columns: `id`, `user_id`, `action_type`, `request_data`, `response_data`, `created_at`

**notifications**
- User notifications
- Columns: `id`, `user_id`, `type`, `title`, `message`, `read`, `link`, `created_at`

### Database Relationships

```
profiles (1) ──→ (M) job_seekers
profiles (1) ──→ (M) employers
profiles (1) ──→ (M) portfolios
profiles (1) ──→ (M) applications

companies (1) ──→ (M) employers
companies (1) ──→ (M) jobs

jobs (1) ──→ (M) applications

applications (1) ──→ (M) application_messages

profiles (1) ──→ (M) blog_posts
blog_categories (1) ──→ (M) blog_posts

profiles (1) ──→ (M) ai_usage_logs
profiles (1) ──→ (M) notifications
```

### Common Queries

1. **Get Jobs with Company Info:**
   ```sql
   SELECT jobs.*, companies.*
   FROM jobs
   JOIN companies ON jobs.company_id = companies.id
   WHERE jobs.status = 'OPEN'
   ORDER BY jobs.created_at DESC;
   ```

2. **Get Applications for a Job:**
   ```sql
   SELECT applications.*, profiles.email, profiles.first_name, profiles.last_name
   FROM applications
   JOIN profiles ON applications.applicant_id = profiles.id
   WHERE applications.job_id = $1
   ORDER BY applications.applied_at DESC;
   ```

3. **Get User's Portfolio:**
   ```sql
   SELECT *
   FROM portfolios
   WHERE user_id = $1
   ORDER BY version DESC
   LIMIT 1;
   ```

---

## Authentication & Authorization

### Authentication Methods

1. **Email/Password:**
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: "user@spu.ac.th",
     password: "password",
   });

   const { data, error } = await supabase.auth.signInWithPassword({
     email: "user@spu.ac.th",
     password: "password",
   });
   ```

2. **Google OAuth (SPU domain only):**
   ```typescript
   const { data, error } = await supabase.auth.signInWithOAuth({
     provider: "google",
     options: {
       queryParams: {
         hd: "spu.ac.th", // Restricts to SPU domain
       },
     },
   });
   ```

3. **Sign Out:**
   ```typescript
   await supabase.auth.signOut();
   ```

### Authorization Patterns

1. **Admin Access Control:**
   ```typescript
   // Check admin whitelist
   const { data } = await supabase
     .from("admin_whitelist")
     .select("*")
     .eq("email", userEmail)
     .eq("active", true)
     .single();

   if (!data) {
     // Not authorized
   }
   ```

2. **Role-Based Access:**
   ```typescript
   const { profile } = useAuth();

   // In component
   if (profile?.role !== "admin") {
     return <Navigate to="/" />;
   }

   // In database (RLS)
   CREATE POLICY "Users can only view their own profile"
   ON profiles FOR SELECT
   USING (auth.uid() = id);
   ```

3. **Resource Ownership:**
   ```typescript
   // Verify user owns the resource
   const { data } = await supabase
     .from("portfolios")
     .select("*")
     .eq("id", portfolioId)
     .eq("user_id", userId)
     .single();

   if (!data) {
     // Unauthorized access
   }
   ```

### Row-Level Security (RLS)

Supabase uses RLS policies to secure data at the database level:

```sql
-- Example RLS policy
CREATE POLICY "Users can view their own applications"
ON applications FOR SELECT
USING (auth.uid() = applicant_id);

CREATE POLICY "Employers can view applications for their jobs"
ON applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.company_id IN (
      SELECT company_id FROM employers WHERE user_id = auth.uid()
    )
  )
);
```

---

## Important Considerations

### Security

1. **Never expose API keys in code:**
   - Use environment variables via `.env`
   - Keys are prefixed with `VITE_` for Vite access

2. **Validate user input:**
   - Use Zod schemas for form validation
   - Sanitize data before database operations

3. **Respect RLS policies:**
   - Don't try to bypass database security
   - Test with different user roles

4. **Secure file uploads (if implemented):**
   - Validate file types and sizes
   - Use Supabase Storage with RLS

### Performance

1. **Optimize queries:**
   ```typescript
   // ❌ N+1 query problem
   for (const job of jobs) {
     const company = await supabase
       .from("companies")
       .select("*")
       .eq("id", job.company_id)
       .single();
   }

   // ✅ Join in single query
   const { data } = await supabase
     .from("jobs")
     .select("*, companies(*)");
   ```

2. **Use React Query caching:**
   ```typescript
   // Data is cached and shared across components
   const { data } = useQuery({
     queryKey: ["jobs"],
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Lazy load large components:**
   ```typescript
   const HeavyComponent = lazy(() => import("./HeavyComponent"));

   <Suspense fallback={<Loading />}>
     <HeavyComponent />
   </Suspense>
   ```

4. **Paginate large lists:**
   ```typescript
   const { data } = await supabase
     .from("jobs")
     .select("*")
     .range(0, 9) // First 10 items
     .order("created_at", { ascending: false });
   ```

### User Experience

1. **Always show loading states:**
   ```typescript
   {isLoading && <Skeleton />}
   {error && <ErrorMessage />}
   {data && <Content />}
   ```

2. **Provide feedback for actions:**
   ```typescript
   toast({ title: "Job posted successfully" });
   ```

3. **Handle errors gracefully:**
   ```typescript
   try {
     await submitJob();
   } catch (error) {
     toast({
       title: "Failed to post job",
       description: "Please try again later",
       variant: "destructive",
     });
   }
   ```

4. **Mobile responsiveness:**
   - Test on mobile breakpoint (< 768px)
   - Use `useIsMobile()` hook for conditional rendering

### AI Features

1. **AI Usage Logging:**
   ```typescript
   // Log AI interactions for analytics
   await supabase.from("ai_usage_logs").insert({
     user_id: userId,
     action_type: "job_recommendation",
     request_data: { portfolio_id },
     response_data: { recommendations },
   });
   ```

2. **Handle AI errors:**
   ```typescript
   const { data, error } = await supabase.functions.invoke("spu-smart-ai", {
     body: { action: "recommend_jobs" },
   });

   if (error) {
     // Fallback to non-AI experience
     console.error("AI service unavailable:", error);
   }
   ```

3. **Rate limiting (if implemented):**
   - Check user's AI usage limits
   - Show appropriate messages when limits reached

### Code Quality

1. **Keep components focused:**
   - One component should do one thing well
   - If a component is > 500 lines, consider splitting

2. **Extract reusable logic to hooks:**
   ```typescript
   function useJobFilters() {
     const [filters, setFilters] = useState({});
     // Filter logic
     return { filters, setFilters, filteredJobs };
   }
   ```

3. **Use TypeScript effectively:**
   ```typescript
   // Define interfaces for props
   interface JobCardProps {
     job: Tables<"jobs">;
     onApply: (jobId: string) => void;
   }
   ```

4. **Comment complex logic:**
   ```typescript
   // Calculate match score based on skills overlap
   // Formula: (matching_skills / total_required_skills) * 100
   const matchScore = ...;
   ```

### Testing Considerations

While no tests are currently implemented, consider:

1. **Test authentication flows**
2. **Test form validation**
3. **Test role-based access**
4. **Test API error handling**
5. **Test responsive design**

---

## Troubleshooting

### Common Issues

#### 1. Authentication Issues

**Problem:** User not logged in after refresh

```typescript
// Solution: Check session persistence
const { data: session } = await supabase.auth.getSession();
```

**Problem:** Google OAuth not restricting to spu.ac.th

```typescript
// Solution: Verify queryParams in OAuth call
options: {
  queryParams: { hd: "spu.ac.th" }
}
```

#### 2. Data Fetching Issues

**Problem:** Data not updating after mutation

```typescript
// Solution: Invalidate React Query cache
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
await queryClient.invalidateQueries({ queryKey: ["jobs"] });
```

**Problem:** RLS preventing data access

```typescript
// Solution: Check user authentication and policies
const { data: { user } } = await supabase.auth.getUser();
console.log("Current user:", user);

// Verify RLS policies in Supabase dashboard
```

#### 3. Build Issues

**Problem:** Build fails with TypeScript errors

```bash
# Solution: Check tsconfig settings
# Strict mode is disabled, but fix obvious type errors
```

**Problem:** Import path errors

```typescript
// Use @ alias consistently
import { Button } from "@/components/ui/button"; // ✅
import { Button } from "../../components/ui/button"; // ❌
```

#### 4. UI Issues

**Problem:** Tailwind classes not applying

```typescript
// Solution: Check class name conflicts
// Use cn() to merge classes properly
import { cn } from "@/lib/utils";
```

**Problem:** Dark mode not working

```typescript
// Solution: Verify ThemeProvider is wrapping app
// Check next-themes configuration
```

#### 5. AI Integration Issues

**Problem:** Edge function not responding

```bash
# Solution: Check Supabase function logs in dashboard
# Verify environment variables are set
# Check Gemini API key validity
```

**Problem:** AI responses are slow

```typescript
// Solution: Add loading states
// Consider implementing streaming responses
// Add timeout handling
```

### Debugging Tips

1. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs
   - Look for API errors and RLS violations

2. **Use React DevTools:**
   - Inspect component state
   - Check context values
   - Profile performance

3. **Network inspection:**
   - Open browser DevTools → Network
   - Check API calls and responses
   - Look for 401/403 errors (auth issues)

4. **Console logging:**
   ```typescript
   console.log("User:", user);
   console.log("Profile:", profile);
   console.log("Data:", data);
   console.error("Error:", error);
   ```

5. **Supabase client debug mode:**
   ```typescript
   // Enable debug logging (temporary)
   const { data, error } = await supabase
     .from("jobs")
     .select("*");

   console.log("Query result:", { data, error });
   ```

### Getting Help

1. **Check existing code:**
   - Similar features likely already exist
   - Look for patterns in existing components

2. **Supabase documentation:**
   - https://supabase.com/docs

3. **React Query documentation:**
   - https://tanstack.com/query/latest

4. **shadcn/ui documentation:**
   - https://ui.shadcn.com

5. **Project README:**
   - Basic setup and deployment info

---

## Quick Reference

### File Paths

```typescript
// Components
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/JobCard";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Utils
import { cn } from "@/lib/utils";

// Supabase
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Pages
import { StudentDashboard } from "@/pages/StudentDashboard";
```

### Common Commands

```bash
# Development
npm run dev                # Start dev server (port 8080)
npm run build             # Production build
npm run preview           # Preview production build
npm run lint              # Run ESLint

# Git
git status                # Check status
git add .                 # Stage changes
git commit -m "message"   # Commit
git push -u origin branch # Push with tracking

# Package management
npm install               # Install dependencies
npm install package-name  # Add package
npx shadcn@latest add component # Add UI component
```

### Environment Variables

```bash
# .env file
VITE_SUPABASE_URL=https://project.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

### Key URLs

- **Development:** http://localhost:8080
- **Lovable Project:** https://lovable.dev/projects/96488ebb-e7ef-41b6-b076-7e51e7d76bc5
- **Supabase Dashboard:** Check your Supabase project

---

## Changelog

### November 26, 2025
- Initial CLAUDE.md creation
- Comprehensive codebase analysis and documentation
- Covered all major aspects: architecture, patterns, workflows, database schema
- Established conventions and best practices
- Added troubleshooting guide

---

## Notes for AI Assistants

When working with this codebase:

1. **Always read files before editing** - Especially large components (>5,000 lines)
2. **Use the @ path alias** - Keeps imports clean and consistent
3. **Follow existing patterns** - Look for similar implementations
4. **Test authentication** - Many features are role-based
5. **Check RLS policies** - Database security is important
6. **Provide user feedback** - Use toast notifications
7. **Handle errors gracefully** - Always catch and display errors
8. **Keep it simple** - Don't over-engineer solutions
9. **Maintain type safety** - Use TypeScript effectively
10. **Document complex logic** - Add comments where needed

### When Making Changes:

- ✅ Read the full file first
- ✅ Understand the existing pattern
- ✅ Test with different user roles
- ✅ Check mobile responsiveness
- ✅ Handle loading and error states
- ✅ Update types if schema changes
- ✅ Follow the commit guidelines
- ✅ Use the designated branch

### When Unsure:

- Look for similar implementations in the codebase
- Check this CLAUDE.md file
- Review the database schema section
- Test your changes with different scenarios

---

**End of CLAUDE.md**
