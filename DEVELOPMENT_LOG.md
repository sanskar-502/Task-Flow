# TaskFlow - Development & Deployment Log

**Project:** TaskFlow - Smart Task Management Platform  
**Developer:** Sanskar Dubey  
**Assignment:** Scalable Web App with Auth & Dashboard (MERN Stack)  
**Timeline:** November 2025  
**Repository:** https://github.com/sanskar-502/Task-Flow

---

## 📋 Project Overview

Built a full-stack task management application with JWT authentication, CRUD operations, and comprehensive security features. The application demonstrates production-ready practices including proper validation, error handling, authentication, and deployment.

### Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, React Query, Zustand
- **Backend:** Express.js, TypeScript, MongoDB, Mongoose
- **Authentication:** JWT (Access + Refresh tokens)
- **Deployment:** Render (Web Services)

---

## 🚀 Development Phases

### Phase 1: Project Setup & Architecture (Day 0-1)

**Tasks Completed:**
1. ✅ Initialized monorepo structure (`/webapp/client` and `/webapp/server`)
2. ✅ Set up TypeScript configuration for both frontend and backend
3. ✅ Configured ESLint, Prettier for code quality
4. ✅ Created comprehensive project structure following best practices

**Files Created:**
- `server/package.json` - Backend dependencies and scripts
- `server/tsconfig.json` - TypeScript configuration
- `client/package.json` - Frontend dependencies
- `client/next.config.js` - Next.js configuration
- `client/tailwind.config.ts` - TailwindCSS setup

**Key Decisions:**
- Chose TypeScript for type safety across the stack
- Selected Next.js App Router for modern React patterns
- Implemented monorepo structure for easier management

---

### Phase 2: Backend Development (Day 1-2)

#### 2.1 Database Models

**Created Models:**
```
server/src/models/
├── User.ts     - User schema with bcrypt password hashing
└── Task.ts     - Task schema with owner reference
```

**User Model Features:**
- Email uniqueness enforcement
- Password hashing with bcrypt (12 rounds)
- Role-based access (user/admin)
- Timestamps (createdAt, updatedAt)
- Index on email field for fast queries

**Task Model Features:**
- Owner reference to User
- Status enum (todo, in-progress, done)
- Tags array for categorization
- Text search index on title, description, tags
- Indexes on owner and status fields

#### 2.2 Authentication System

**Files Created:**
```
server/src/
├── routes/auth.ts          - Register, login, logout endpoints
├── middleware/auth.ts      - JWT verification middleware
└── utils/jwt.ts           - Token generation & verification
```

**Security Features Implemented:**
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT access tokens (15 min expiry)
- ✅ JWT refresh tokens (7 day expiry)
- ✅ HttpOnly cookies for token storage
- ✅ Automatic token refresh on expiry
- ✅ CORS configuration with credentials
- ✅ Authorization header support (Bearer token)

**Authentication Flow:**
1. User registers → Password hashed → Tokens generated
2. Tokens stored in HttpOnly cookies AND returned in response body
3. Frontend stores tokens in localStorage
4. Subsequent requests include `Authorization: Bearer <token>` header
5. Backend validates token from header or cookies
6. Auto-refresh expired access tokens using refresh token

#### 2.3 API Routes

**Implemented Endpoints:**

**Auth Routes (`/api/auth`):**
- `POST /register` - Create new user account
- `POST /login` - Authenticate user
- `POST /logout` - Clear auth tokens

**User Routes (`/api/users`):**
- `GET /me` - Get current user profile (protected)
- `PATCH /me` - Update user profile (protected)

**Task Routes (`/api/tasks`):**
- `GET /` - List tasks with search, filter, pagination (protected)
- `POST /` - Create new task (protected)
- `GET /:id` - Get single task (protected)
- `PATCH /:id` - Update task (protected)
- `DELETE /:id` - Delete task (protected)

#### 2.4 Validation Layer

**Files Created:**
```
server/src/validators/
├── auth.ts    - Register & login validation
└── tasks.ts   - Task CRUD validation
```

**Validation Features:**
- Zod schemas for runtime type checking
- Email format validation
- Password strength requirements (min 8 chars)
- Task status enum validation
- Request body sanitization

#### 2.5 Middleware & Security

**Middleware Implemented:**
```
server/src/middleware/
├── auth.ts       - JWT authentication
├── cors.ts       - CORS configuration
└── error.ts      - Global error handler
```

**Security Headers:**
- Helmet.js for security headers
- Rate limiting (300 requests per 15 minutes)
- CORS with specific origin allowlist
- Cookie security (HttpOnly, Secure in production, SameSite=Lax)

**Error Handling:**
- Consistent error response format: `{ error: "message" }`
- Zod validation errors properly formatted
- MongoDB duplicate key errors handled
- 4xx/5xx status codes appropriately set

#### 2.6 Database Configuration

**Connection Setup:**
- MongoDB Atlas cloud database
- Connection pooling enabled
- Indexes created on deployment
- Proper error handling for connection failures

**Database Indexes:**
- `users.email` - Unique index
- `tasks.owner` - Regular index
- `tasks.status` - Regular index  
- `tasks.title, tasks.description, tasks.tags` - Text search index

---

### Phase 3: Frontend Development (Day 2)

#### 3.1 Project Structure

**Created Structure:**
```
client/
├── app/
│   ├── (auth)/              - Public routes
│   │   ├── login/          
│   │   └── register/       
│   ├── (protected)/         - Protected routes
│   │   ├── dashboard/      
│   │   ├── profile/        
│   │   └── layout.tsx      - Auth guard
│   ├── layout.tsx          - Root layout
│   └── globals.css         - Global styles
├── components/
│   ├── Navbar.tsx          - Navigation component
│   ├── TaskTable.tsx       - Task list with actions
│   └── TaskForm.tsx        - Create/edit task form
├── lib/
│   ├── axios.ts            - Axios instance with interceptors
│   ├── auth.ts             - Auth API functions
│   ├── queryClient.ts      - React Query configuration
│   └── validators.ts       - Zod validation schemas
└── store/
    └── auth.store.ts       - Zustand auth state
```

#### 3.2 Authentication Pages

**Login Page (`/login`):**
- React Hook Form with Zod validation
- Email and password fields
- Client-side validation
- Error message display
- Link to registration
- Loading state during submission

**Register Page (`/register`):**
- Name, email, password fields
- Password confirmation
- Validation feedback
- Success redirect to dashboard
- Link to login

**Protected Route Layout:**
- Auto-check authentication on mount
- Redirect to login if unauthenticated
- Loading spinner during auth check
- Persist user state across page refreshes

#### 3.3 Dashboard

**Features Implemented:**
- Task list with pagination
- Search by title/description/tags
- Filter by status (todo, in-progress, done)
- Create new task button
- Edit task inline or modal
- Delete task with confirmation
- Empty state for no tasks
- Loading skeletons
- Error boundaries

**State Management:**
- React Query for server state
- Automatic refetch on mutation
- Optimistic updates for better UX
- Cache invalidation on CRUD operations

#### 3.4 Components

**Navbar Component:**
- App logo/title
- Navigation links (Dashboard, Profile)
- User name display
- Logout button
- Mobile responsive (hamburger menu)

**TaskTable Component:**
- Sortable columns
- Status badges with colors
- Action buttons (Edit, Delete)
- Pagination controls
- Items per page selector

**TaskForm Component:**
- Title, description inputs
- Status dropdown
- Tags input (comma-separated)
- Form validation
- Submit/cancel buttons
- Works for both create and edit

#### 3.5 API Integration

**Axios Configuration:**
```typescript
// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Auth Functions:**
- `register()` - Create account, store tokens
- `login()` - Authenticate, store tokens
- `logout()` - Clear tokens, invalidate session
- `getMe()` - Fetch current user
- `updateProfile()` - Update user data

**Task Functions:**
- `getTasks()` - List with filters
- `createTask()` - Create new
- `updateTask()` - Edit existing
- `deleteTask()` - Remove task

#### 3.6 Styling

**TailwindCSS Setup:**
- Custom color palette
- Responsive breakpoints
- Utility-first approach
- Component classes in globals.css
- Dark mode ready (not enabled)

**Responsive Design:**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Hamburger menu for mobile
- Stacked forms on small screens
- Scrollable tables on mobile

---

### Phase 4: Testing & Validation (Day 2-3)

#### 4.1 Backend Testing

**Manual Testing via Postman:**
- ✅ User registration with valid data
- ✅ Duplicate email rejection
- ✅ Login with correct credentials
- ✅ Login with incorrect password
- ✅ Token cookie setting
- ✅ Protected route access with valid token
- ✅ Protected route rejection without token
- ✅ Task CRUD operations
- ✅ Search functionality
- ✅ Pagination correctness
- ✅ Status filtering

**Validation Testing:**
- ✅ Invalid email format rejected
- ✅ Short password rejected (< 8 chars)
- ✅ Empty required fields rejected
- ✅ Invalid status enum rejected
- ✅ Wrong data types rejected

**Security Testing:**
- ✅ Password hashing verified (bcrypt $2a$12$...)
- ✅ HttpOnly cookies set correctly
- ✅ Secure flag in production
- ✅ CORS headers present
- ✅ Rate limiting functional

#### 4.2 Frontend Testing

**Manual Browser Testing:**
- ✅ Registration flow complete
- ✅ Login flow complete
- ✅ Dashboard loads tasks
- ✅ Create task works
- ✅ Edit task works
- ✅ Delete task works
- ✅ Search filters tasks
- ✅ Status filter works
- ✅ Pagination navigates correctly
- ✅ Logout clears session
- ✅ Protected routes redirect when unauthenticated

**Responsive Testing:**
- ✅ Mobile view (375px)
- ✅ Tablet view (768px)
- ✅ Desktop view (1024px+)
- ✅ Hamburger menu on mobile
- ✅ Forms adapt to screen size

#### 4.3 Integration Testing

**End-to-End Flows:**
1. ✅ Register → Auto-login → Dashboard
2. ✅ Login → Create task → View in list
3. ✅ Edit task → Changes reflect immediately
4. ✅ Delete task → Removed from list
5. ✅ Logout → Redirect to login → Cannot access dashboard
6. ✅ Token expiry → Auto-refresh → Continue session

---

### Phase 5: Documentation (Day 3)

#### 5.1 README.md

**Sections Created:**
- Project overview and features
- Tech stack breakdown
- Project structure diagram
- Installation instructions
- Environment variable configuration
- Local development setup
- API documentation
- Deployment guide
- Troubleshooting section

#### 5.2 Postman Collection

**Created Collection:**
- 7 API endpoints documented
- Example requests for each endpoint
- Expected responses
- Environment variables setup
- Authentication flow examples

**File:** `postman_collection.json`

#### 5.3 Deployment Guide

**Created:** `DEPLOYMENT.md`

**Covered Topics:**
- MongoDB Atlas setup (free tier)
- GitHub repository creation
- Render backend deployment (Web Service)
- Render frontend deployment (Static Site → Web Service)
- Environment variables for production
- CORS configuration
- Testing deployed app
- Troubleshooting common issues
- Monitoring and logs

---

### Phase 6: Deployment (Day 3)

#### 6.1 Git Repository Setup

**Actions Taken:**
```bash
git init
git add .
git commit -m "Initial commit: Complete TaskFlow application"
git branch -M main
git remote add origin https://github.com/sanskar-502/Task-Flow.git
git push -u origin main
```

**Files Excluded (`.gitignore`):**
- `node_modules/`
- `.env`, `.env.local`
- Build outputs (`dist/`, `.next/`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Logs (`*.log`)
- Alternative lock files (`yarn.lock`, `pnpm-lock.yaml`)

**Files Kept:**
- `package-lock.json` (for reproducible builds)
- `.env.example` files (templates)

#### 6.2 MongoDB Atlas Setup

**Configuration:**
- Created free tier cluster (M0)
- Region: AWS / us-east-1
- Database name: `taskflow`
- Network access: Allow all IPs (0.0.0.0/0)
- Database user created with password
- Connection string generated

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
```

#### 6.3 Backend Deployment (Render)

**Service Configuration:**
- **Type:** Web Service
- **Name:** Task-Flow-api
- **Repository:** sanskar-502/Task-Flow
- **Branch:** main
- **Root Directory:** `server`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Environment Variables Set:**
```
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>
PORT=4000
CLIENT_ORIGIN=https://task-flow-web.onrender.com
```

**Deployment Issues Encountered:**

**Issue 1: TypeScript Build Errors**
- **Error:** Missing @types packages during build
- **Cause:** @types packages in devDependencies, but Render doesn't install them
- **Solution:** Moved all @types/* packages to dependencies
- **Files Modified:** `server/package.json`, `server/tsconfig.json`
- **Commit:** `45faa73` - "Fix TypeScript build: add @types to dependencies and update tsconfig"

**Deployment URL:** `https://task-flow-api-01up.onrender.com`

#### 6.4 Frontend Deployment (Render)

**Initial Attempt: Static Site**
- **Issue:** 404 errors on routes, Next.js App Router needs server
- **Lesson:** Static Site deployment doesn't support dynamic routing

**Final Configuration: Web Service**
- **Type:** Web Service
- **Name:** Task-Flow-Frontend
- **Repository:** sanskar-502/Task-Flow
- **Branch:** main
- **Root Directory:** `client`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Environment Variables Set:**
```
NEXT_PUBLIC_API_URL=https://task-flow-api-01up.onrender.com/api
```

**Deployment URL:** `https://task-flow-app-1xjy.onrender.com/`

#### 6.5 Cross-Domain Authentication Issue

**Problem:**
- 401 Unauthorized errors after login
- Cookies not sent cross-domain
- Frontend and backend on different domains

**Root Cause:**
- Browsers block third-party cookies by default
- HttpOnly cookies from `task-flow-api-01up.onrender.com` not accessible to `task-flow-kpou.onrender.com`

**Solution Implemented:**
1. **Backend Changes:**
   - Return tokens in response body (in addition to cookies)
   - Accept tokens from Authorization header (in addition to cookies)
   - Modified `auth.ts` routes to include `accessToken` and `refreshToken` in response
   - Updated `auth.ts` middleware to check `Authorization: Bearer <token>` header first

2. **Frontend Changes:**
   - Store tokens in localStorage after login/register
   - Add axios interceptor to include Authorization header in all requests
   - Clear localStorage on logout

**Files Modified:**
- `server/src/routes/auth.ts`
- `server/src/middleware/auth.ts`
- `client/lib/axios.ts`
- `client/lib/auth.ts`

**Commits:**
- `a0c07a0` - "Fix: Add token-based auth for cross-domain support"
- `fdc2333` - "docs: Update README for dual authentication support"

**Result:** ✅ Authentication now works across different domains

---

## 📊 Final Statistics

### Codebase
- **Total Files:** 50+
- **Lines of Code:** ~3,500
- **Languages:** TypeScript (95%), CSS (3%), Config (2%)

### Backend
- **Routes:** 11 endpoints
- **Models:** 2 (User, Task)
- **Middleware:** 3 (Auth, CORS, Error)
- **Validators:** 5 Zod schemas

### Frontend
- **Pages:** 5 (Login, Register, Dashboard, Profile, Home)
- **Components:** 3 (Navbar, TaskTable, TaskForm)
- **Store:** 1 Zustand store
- **API Functions:** 8

### Git
- **Total Commits:** 5
- **Branches:** 1 (main)

### Security Features
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ HttpOnly cookies
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Mongoose)
- ✅ XSS protection

---

## 🎯 Project Achievements

### Functional Requirements
- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Protected dashboard
- ✅ CRUD operations on tasks
- ✅ Search functionality
- ✅ Filtering by status
- ✅ Pagination
- ✅ Responsive design

### Technical Requirements
- ✅ TypeScript throughout
- ✅ Clean architecture (MVC-like pattern)
- ✅ Validation on client and server
- ✅ Error handling
- ✅ Security best practices
- ✅ Production deployment
- ✅ Documentation

### Bonus Features Implemented
- ✅ Token refresh mechanism
- ✅ Optimistic UI updates
- ✅ Loading states
- ✅ Empty states
- ✅ Mobile responsive
- ✅ Text search on tasks
- ✅ Tag support
- ✅ Profile management
- ✅ Postman collection
- ✅ Deployment guide

---

## 🔧 Troubleshooting & Solutions

### Issue 1: TypeScript Compilation Errors on Render
**Error:** `Cannot find name 'console'`, `Cannot find name 'Request'`  
**Solution:** Moved @types packages from devDependencies to dependencies

### Issue 2: Frontend 404 Errors
**Error:** Routes returning 404 on Render Static Site  
**Solution:** Changed from Static Site to Web Service deployment

### Issue 3: 401 Unauthorized After Login
**Error:** Cookies not sent cross-domain  
**Solution:** Implemented dual authentication (Authorization header + cookies)

### Issue 4: MongoDB Connection String
**Error:** Invalid connection string format  
**Solution:** Properly encoded password in URI, ensured proper format

### Issue 5: CORS Errors
**Error:** CORS policy blocking requests  
**Solution:** Configured CORS middleware with correct CLIENT_ORIGIN

---

## 📈 Lessons Learned

1. **Cross-domain cookies are problematic** - Better to use Authorization header for production
2. **TypeScript types need to be in dependencies for build** - devDependencies not installed in production
3. **Next.js App Router requires a server** - Can't use static site deployment for dynamic routes
4. **MongoDB indexes are crucial** - Text search needs proper indexes defined
5. **Environment variables are environment-specific** - Development and production configs differ

---

## 🚀 Deployment URLs

- **Frontend:** https://task-flow-app-1xjy.onrender.com/
- **Backend:** https://task-flow-api-01up.onrender.com
- **Repository:** https://github.com/sanskar-502/Task-Flow

---

## 🔮 Future Enhancements

### Potential Improvements
- [ ] Email verification on registration
- [ ] Forgot password flow
- [ ] Task due dates and reminders
- [ ] Task assignment to other users
- [ ] Team/workspace support
- [ ] File attachments on tasks
- [ ] Activity logs
- [ ] Advanced filtering (date range, priority)
- [ ] Export tasks (CSV, PDF)
- [ ] Dark mode
- [ ] Websocket for real-time updates
- [ ] Task comments/collaboration
- [ ] Notifications system

### Scaling Considerations
- Redis for session management and caching
- CDN for static assets
- Load balancer for multiple backend instances
- Database read replicas
- Message queue for async tasks
- Elasticsearch for advanced search
- Microservices architecture for larger scale

---

## 📝 Conclusion

Successfully developed and deployed a production-ready task management application with modern tech stack, comprehensive security, and proper documentation. The application demonstrates full-stack development skills, authentication implementation, database design, API development, frontend development with React/Next.js, and cloud deployment.

**Total Development Time:** 3 days  
**Status:** ✅ Complete and Deployed  
**Performance:** Passing all requirements

---

## 📞 Contact

**Developer:** Sanskar  
**GitHub:** https://github.com/sanskar-502  
**Project Repository:** https://github.com/sanskar-502/Task-Flow

---

*Log generated on: November 7, 2025*
*Last updated: November 7, 2025*
