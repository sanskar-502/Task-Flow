# TaskFlow - Smart Task Management Platform

A production-ready, scalable task management application featuring JWT authentication, protected routes, and full CRUD operations. Built with Next.js (App Router), TypeScript, TailwindCSS, Express, and MongoDB.

Streamline your workflow with TaskFlow - organize tasks, track progress, and boost productivity.

## ✨ Features

- ✅ JWT authentication (access + refresh tokens in HttpOnly cookies)
- ✅ Protected routes with automatic token refresh
- ✅ User registration and login
- ✅ User profile management
- ✅ Full CRUD operations on Tasks
- ✅ Task search with MongoDB text index
- ✅ Task filtering by status
- ✅ Pagination
- ✅ Client & server validation with Zod
- ✅ Responsive UI with TailwindCSS
- ✅ Type-safe with TypeScript
- ✅ Security: bcrypt, Helmet, rate limiting, CORS
- ✅ Optimistic updates with React Query

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Validation
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **Zod** - Validation
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **CORS** - Cross-origin configuration

## 📁 Project Structure

```
webapp/
├── client/                    # Next.js frontend
│   ├── app/
│   │   ├── (auth)/           # Auth pages (login, register)
│   │   ├── (protected)/      # Protected pages (dashboard, profile)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/           # React components
│   ├── lib/                  # Utilities, API, validators
│   └── store/                # Zustand store
├── server/                   # Express backend
│   └── src/
│       ├── models/           # Mongoose models
│       ├── routes/           # API routes
│       ├── validators/       # Zod schemas
│       ├── middleware/       # Auth, error, CORS
│       ├── utils/            # JWT utilities
│       └── index.ts          # Entry point
├── README.md
└── postman_collection.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or MongoDB Atlas URI

### Installation

1. **Clone the repository:**

```bash
cd webapp
```

2. **Install server dependencies:**

```bash
cd server
npm install
```

3. **Install client dependencies:**

```bash
cd ../client
npm install
```

### Environment Setup

1. **Server environment variables:**

Create `server/.env` from `server/.env.example`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/scale_app
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
CLIENT_ORIGIN=http://localhost:3000
PORT=4000
NODE_ENV=development
```

2. **Client environment variables:**

Create `client/.env.local` from `client/.env.local.example`:

```bash
cd ../client
cp .env.local.example .env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Running Locally

1. **Start MongoDB** (if running locally):

```bash
mongod
```

2. **Start the server** (from `server/` directory):

```bash
npm run dev
```

Server runs on `http://localhost:4000`

3. **Start the client** (from `client/` directory, in a new terminal):

```bash
npm run dev
```

Client runs on `http://localhost:3000`

4. **Open your browser** and navigate to `http://localhost:3000`

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "..."
  }
}
```

Sets cookies: `access_token` (15m), `refresh_token` (7d)

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { ... }
}
```

Sets cookies: `access_token` (15m), `refresh_token` (7d)

#### Logout
```http
POST /auth/logout

Response: 200 OK
{
  "ok": true
}
```

Clears cookies.

### User Endpoints

#### Get Current User
```http
GET /users/me
Authorization: via cookies

Response: 200 OK
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "..."
  }
}
```

#### Update Profile
```http
PATCH /users/me
Content-Type: application/json
Authorization: via cookies

{
  "name": "Jane Doe"
}

Response: 200 OK
{
  "user": { ... }
}
```

### Task Endpoints

#### List Tasks
```http
GET /tasks?q=milk&status=todo&page=1&limit=10
Authorization: via cookies

Response: 200 OK
{
  "items": [
    {
      "id": "...",
      "title": "Buy milk",
      "description": "...",
      "status": "todo",
      "tags": ["shopping"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 42,
  "page": 1,
  "pages": 5
}
```

Query parameters:
- `q` - Search text (searches title, description, tags)
- `status` - Filter by status: `todo`, `in_progress`, `done`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

#### Create Task
```http
POST /tasks
Content-Type: application/json
Authorization: via cookies

{
  "title": "Buy milk",
  "description": "Get 2% milk",
  "status": "todo",
  "tags": ["shopping", "urgent"]
}

Response: 201 Created
{
  "task": { ... }
}
```

#### Get Task
```http
GET /tasks/:id
Authorization: via cookies

Response: 200 OK
{
  "task": { ... }
}
```

#### Update Task
```http
PATCH /tasks/:id
Content-Type: application/json
Authorization: via cookies

{
  "status": "done"
}

Response: 200 OK
{
  "task": { ... }
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: via cookies

Response: 200 OK
{
  "ok": true
}
```

### Error Responses

All errors return:
```json
{
  "error": "Error message"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📮 Postman Collection

Import `postman_collection.json` into Postman:

1. Open Postman
2. Click **Import**
3. Select `postman_collection.json`
4. Collection variable `api` is set to `http://localhost:4000/api`
5. Ensure **cookie jar** is enabled for session continuity

The collection includes all endpoints with example requests.

## 🏗️ Production Scaling Strategy

### Deployment Architecture

1. **Frontend**: Deploy on Vercel (or Node.js server with PM2)
2. **Backend**: Deploy behind Nginx/ALB with HTTPS
3. **Database**: MongoDB Atlas with replica sets

### Configuration Checklist

#### Environment Variables
```bash
# Backend .env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_ACCESS_SECRET=<strong-random-secret-64-chars>
JWT_REFRESH_SECRET=<different-strong-random-secret-64-chars>
CLIENT_ORIGIN=https://yourdomain.com
PORT=4000
COOKIE_DOMAIN=.yourdomain.com  # For cross-subdomain cookies
```

#### Cookie Security (Automatic in Production)
- ✅ `HttpOnly`: ✅ Always enabled
- ✅ `Secure`: ✅ Auto-enabled when `NODE_ENV=production`
- ✅ `SameSite=Lax`: ✅ Always enabled
- ✅ `Domain`: ✅ Set via `COOKIE_DOMAIN` env var

#### HTTPS
- Deploy backend behind reverse proxy (Nginx/ALB) with SSL certificate
- Use Let's Encrypt or cloud provider SSL
- Redirect all HTTP to HTTPS

### Scaling Backend

- Stateless design enables horizontal scaling
- Use PM2 for process management on VMs
- Or containerize with Docker and orchestrate with Kubernetes
- Add health check endpoints for load balancers

### Database Optimization

- Indexes already configured on:
  - `owner` (tasks)
  - `status` (tasks)
  - `email` (users, unique)
  - Text index on `title`, `description`, `tags`
- Consider sharding by user ID for massive scale
- Use MongoDB Atlas auto-scaling

### Observability

- Add structured logging (winston, pino)
- Integrate APM (DataDog, New Relic)
- Set up error tracking (Sentry)
- Monitor key metrics: response time, error rate, DB query time

### Optional Enhancements

- **Redis**: Token deny-list for logout-all, rate limiting, caching
- **CDN**: Serve static assets via CloudFront/Cloudflare
- **Queue**: Background jobs with Bull/BullMQ
- **Search**: Elasticsearch for advanced task search

## ✅ Definition of Done

- ✅ Frontend + backend run locally with env examples
- ✅ Register → Login → Dashboard → CRUD → Logout works
- ✅ Protected routes block unauthenticated users
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ Tokens validated; cookies HttpOnly
- ✅ Zod validation on both client and server
- ✅ Search, filter, pagination on tasks
- ✅ Postman collection provided
- ✅ README explains setup and scaling
- ✅ Code formatted and typed with TypeScript
- ✅ Meaningful errors with `{ "error": "Message" }` shape

## 🧪 Testing the Application

### Manual Testing Flow

1. **Register**: Go to `/register`, create account
2. **Login**: Redirected to dashboard, or go to `/login`
3. **Dashboard**: 
   - Create tasks using "Create Task" button
   - Search for tasks using search box
   - Filter by status using dropdown
   - Edit tasks by clicking "Edit"
   - Delete tasks by clicking "Delete"
   - Navigate pages with pagination controls
4. **Profile**: Go to `/profile`, update name
5. **Logout**: Click "Logout" in navbar, redirected to login

### Acceptance Criteria

**Scenario: Register and login**
- ✅ Register with unique email and strong password
- ✅ Receive HttpOnly auth cookies
- ✅ Access `/api/users/me` successfully
- ✅ Redirected to `/dashboard`

**Scenario: Protected route guard**
- ✅ Navigate to `/dashboard` without auth → redirected to `/login`

**Scenario: CRUD tasks with search and filter**
- ✅ Create task "Buy milk"
- ✅ Search for "milk" → task appears
- ✅ Update status to "done"
- ✅ Filter `status=done` → task appears
- ✅ Delete task → no longer in list

## 🔐 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: 
  - Access token: 15 minutes
  - Refresh token: 7 days
  - Both stored in HttpOnly cookies
- **Cookie Security**:
  - ✅ `HttpOnly`: Prevents XSS attacks (cookies not accessible via JavaScript)
  - ✅ `SameSite=Lax`: CSRF protection
  - ✅ `Secure`: HTTPS-only in production (set via `NODE_ENV=production`)
  - ✅ `Domain`: Configurable for cross-subdomain support in production (set `COOKIE_DOMAIN=.yourdomain.com`)
  - ✅ Automatic token refresh via refresh token
- **CORS**: Configured with credentials, origin allowlist
- **Helmet**: Security headers enabled
- **Rate Limiting**: 300 requests per 15 minutes per IP
- **Input Validation**: Zod schemas on all inputs
- **X-Powered-By**: Disabled

## 📝 Development Scripts

### Server
```bash
npm run dev      # Development with auto-reload
npm run build    # TypeScript compilation
npm start        # Production mode
```

### Client
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

## 🤝 Contributing

This is a demonstration project. For production use:
1. Add comprehensive test coverage (Jest, React Testing Library, Supertest)
2. Set up CI/CD pipeline
3. Add logging and monitoring
4. Implement rate limiting per user
5. Add email verification
6. Add password reset flow
7. Consider role-based access control (RBAC)

## 📄 License

MIT

## 👨‍💻 Author

**TaskFlow** - Built with modern best practices for scalable task management.
