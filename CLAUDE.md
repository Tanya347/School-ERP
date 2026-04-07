# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a School ERP (Enterprise Resource Planning) portal with a React frontend and Node.js/Express backend using MongoDB.

**Architecture**: MERN stack (MongoDB, Express, React, Node.js)

**User Roles**: Admin, Faculty, Student

## Repository Structure

```
├── client/          # React frontend (port 3000)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components organized by feature
│   │   └── utils/         # Utility functions, hooks, context, Redux store
│   └── package.json
└── server/          # Node.js/Express backend (port 5500)
    ├── controllers/       # Request handlers
    ├── models/            # Mongoose schemas
    ├── routes/            # API route definitions
    ├── utils/             # Helper functions and middleware
    └── index.js           # Server entry point
```

## Common Development Commands

### Client (Frontend)

```bash
cd client
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run tests
```

### Server (Backend)

```bash
cd server
npm run dev        # Start development server with nodemon (port 5500)
npm start          # Start production server
```

### Running Both

The client proxies API requests to the server. Both must be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5500

## Environment Variables

### Server (.env)
```
PORT=5500
MONGO=<MongoDB connection string>
JWT=<JWT secret>
JWT_EXPIRES_IN=1h
JWT_COOKIE_EXPIRES_IN=90
CLIENT=http://localhost:3000
CLOUDINARY_CLOUD_NAME=<cloudinary name>
CLOUDINARY_API_KEY=<cloudinary key>
CLOUDINARY_API_SECRET=<cloudinary secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=<email>
EMAIL_PASSWORD=<app password>
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5500/api
```

## Architecture Patterns

### Backend Patterns

**Error Handling**: Uses a custom `AppError` class and `catchAsync` wrapper for async route handlers.
- `utils/customError.js` - AppError class for operational errors
- `utils/catchAsync.js` - Wraps async functions to catch errors
- `utils/errorHandler.js` - Global error handling middleware

**Authentication**: JWT-based auth with cookies.
- `controllers/auth.js` - Contains `protect()`, `restrictTo()`, login/logout handlers
- Routes use middleware: `protect()` first, then `restrictTo(roles.admin, roles.faculty)`

**Route Structure**: Standard Express pattern:
```javascript
// routes/<resource>.js
router.post("/", protect(), restrictTo(roles.admin), handler);
router.get("/", protect(), getAll);
router.get("/:id", protect(), getOne);
router.put("/:id", protect(), restrictTo(roles.admin), upload.single('file'), update);
router.delete("/:id", protect(), restrictTo(roles.admin), deleteOne);
```

**File Uploads**: Uses multer + Cloudinary.
- `utils/multer.js` - File upload config
- `utils/cloudinary.js` - Cloudinary integration
- Controllers handle upload before saving to DB

**Models**: Mongoose schemas with validation and pre-save hooks.
- Password hashing on save
- Auto-generated enrollment numbers
- Validation using `validator` package

### Frontend Patterns

**State Management**: Redux Toolkit with slices
- `utils/store/store.js` - Store configuration
- `utils/store/slices/` - Feature slices (auth, faculty, admin, notifications, school)
- `injectStore()` pattern for axios interceptors

**API Calls**: Custom axios interceptor with auth handling
- `utils/shared/axiosInterceptor.js` - Base API instance with credentials
- `utils/service/useFetch.js` - Hook for GET requests with loading/error states
- `utils/endpoints/` - URL generators for different resources

**Routing**: React Router with protected routes
- `utils/routes/AdminRoutes.js` - Admin-specific routes
- `utils/routes/FacultyRoutes.js` - Faculty-specific routes
- `utils/routes/StudentRoutes.js` - Student-specific routes
- `App.js` - Main router with role-based entry points

**Data Tables**: MUI DataGrid with column configs in `utils/datatablesource/`

**Forms**: Reusable form inputs defined in `utils/formsource/`
- Forms use controlled components with validation
- File uploads handled via FormData

**Permissions**: Role-based checks via `utils/shared/commons.js`
```javascript
checkAdmin(user.role)
checkFaculty(user.role)
checkStudent(user.role)
checkEditor(user.role)  // Admin or Faculty
```

## Key Directories

### Client
- `src/components/shared/` - Shared/reusable components (datatable, list, etc.)
- `src/pages/new/` - Create forms
- `src/pages/edit/` - Edit forms
- `src/pages/home/` - Dashboard/home pages
- `src/utils/validators/` - Form validation logic
- `src/utils/style/` - SCSS styles (dark.scss, base.scss, form.scss)

### Server
- `controllers/` - Business logic with `catchAsync` wrappers
- `models/` - Mongoose schemas with validation
- `routes/` - Route definitions importing controllers and auth middleware
- `utils/email.js` - Email sending utilities
- `utils/constants.js` - Shared constants (roles, success messages)

## Important Notes

- Server uses ES modules (`"type": "module"` in package.json) - use `import` not `require`
- MongoDB auto-generates `enroll` field for students based on school count + year
- Cloudinary folder name: "erp_portal"
- Password requirements: min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
- Auth cookies are httpOnly and secure in production
- Axios interceptor handles 401 responses by dispatching logout
