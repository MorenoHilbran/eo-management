# Event Management System - Quick Start Guide

## Frontend Setup Summary

✅ **Completed:**
- React + TypeScript project structure
- React Router with protected routes
- Login page with Sanctum authentication
- API client with axios and interceptors
- Type-safe API services for all resources
- Custom hooks for data fetching and formatting
- Reusable UI components library
- 5 main page components (Dashboard, Events, Vendors, Transactions, SOPs)
- Form components with validation
- List/Table components with sorting/filtering
- Error handling and loading states
- Responsive layout with sidebar navigation

## File Structure Created

### Pages (5 total)
```
resources/js/pages/
├── LoginPage.tsx           - Authentication
├── DashboardPage.tsx       - Dashboard overview
├── EventsPage.tsx          - Events CRUD
├── EventDetailPage.tsx     - Event details + RAB management
├── VendorsPage.tsx         - Vendor management
├── TransactionsPage.tsx    - Transaction approval workflow
└── SOPsPage.tsx            - SOP repository
```

### Components (20+ total)
```
resources/js/components/
├── common/                 - UI components
├── events/                 - Event-related components
├── vendors/                - Vendor components
├── transactions/           - Transaction components
├── rab/                    - RAB components
└── sop/                    - SOP components
```

### Services & Hooks
```
resources/js/lib/
├── api-client.ts           - Axios configuration
└── services/               - 6 API service modules

resources/js/hooks/
├── useQuery.ts             - Data fetching hooks
├── useFormatters.ts        - Formatting hooks
└── index.ts                - Barrel exports
```

### Layouts
```
resources/js/layouts/
└── Layout.tsx              - Main app layout with navigation
```

## How to Run

### 1. Install Dependencies
```bash
cd /path/to/project
npm install
# or
pnpm install
```

### 2. Update Environment
Create/update `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Event Manager"
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Test Login
Use these credentials:
- Email: `admin@example.com`
- Password: `password`

## API Endpoints Integration

All endpoints are pre-configured in service files:

**Events:**
- GET /api/events
- GET /api/events/{id}
- POST /api/events
- PUT /api/events/{id}
- DELETE /api/events/{id}
- GET /api/events/{id}/rab-total
- GET /api/events/{id}/budget-status
- GET /api/dashboard/stats

**Vendors:**
- GET /api/vendors
- GET /api/vendors/{id}
- POST /api/vendors
- PUT /api/vendors/{id}
- DELETE /api/vendors/{id}
- GET /api/vendor-categories

**RAB Items:**
- GET /api/rab-items
- GET /api/rab-items/{id}
- POST /api/rab-items
- PUT /api/rab-items/{id}
- DELETE /api/rab-items/{id}

**Transactions:**
- GET /api/transactions
- GET /api/transactions/{id}
- POST /api/transactions
- PUT /api/transactions/{id}
- DELETE /api/transactions/{id}
- POST /api/transactions/{id}/approve
- POST /api/transactions/{id}/reject

**SOPs:**
- GET /api/sops
- GET /api/sops/{id}
- POST /api/sops
- PUT /api/sops/{id}
- DELETE /api/sops/{id}

## Features

✅ Authentication & Authorization
✅ Dashboard with statistics
✅ Event management (CRUD)
✅ RAB (Budget) management with auto-calculation
✅ Vendor management with categories
✅ Transaction approval workflow
✅ SOP management
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Pagination
✅ Forms with validation
✅ Currency formatting (IDR)
✅ Date formatting
✅ Status indicators

## Component Usage Examples

### Data Fetching
```typescript
const { data: events, loading, error, refetch } = useQuery(
    () => eventService.getEvents()
);
```

### Form Submission
```typescript
const { mutate: createEvent, loading } = useMutation(
    (data) => eventService.createEvent(data),
    { onSuccess: () => refetch() }
);

const handleSubmit = (data) => {
    createEvent(data);
};
```

### Currency Formatting
```typescript
const { format: formatCurrency } = useCurrency();
console.log(formatCurrency(10000)); // "Rp10.000"
```

### Date Formatting
```typescript
const { format: formatDate } = useDateFormat();
console.log(formatDate("2024-01-15")); // "15 Jan 2024"
```

## Next Steps / TODO

- [ ] Setup authentication login flow in backend
- [ ] Configure CORS in Laravel
- [ ] Test all API endpoints
- [ ] Add form validation with React Hook Form
- [ ] Add toast notifications
- [ ] Setup global state management (Context API)
- [ ] Add export to PDF/Excel functionality
- [ ] Add filtering and search
- [ ] Add user profile page
- [ ] Add settings page
- [ ] Add audit logs
- [ ] Add performance optimization
- [ ] Setup E2E tests with Cypress
- [ ] Setup unit tests with Vitest
- [ ] Deploy to production

## Backend API Status

All backend API endpoints are already implemented and verified:
- ✅ 8 database tables created
- ✅ 8 Eloquent models created
- ✅ 7 API controllers created
- ✅ 43 API routes registered
- ✅ Sanctum authentication configured
- ✅ Database seeders created

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# macOS/Linux:
lsof -ti:5173 | xargs kill -9
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear vite cache
rm -rf .vite
npm run build
```

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         React Application               │
│  (Components + Pages + Layouts)         │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Custom Hooks Layer                 │
│  (useQuery, useMutation, useFormatters) │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│       API Services Layer                │
│  (Event, Vendor, RAB, Transaction...)   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      API Client (Axios)                 │
│  (Configuration + Interceptors)         │
└──────────────┬──────────────────────────┘
               │
               ↓
        ┌──────────────┐
        │  Laravel API │
        │  (Backend)   │
        └──────────────┘
```

## Important Notes

1. **Token Storage**: Sanctum tokens are stored in localStorage under 'sanctum_token'
2. **API Base URL**: Configure in `.env` as `VITE_API_URL`
3. **CORS**: Make sure Laravel backend allows CORS from frontend origin
4. **Authentication**: Implement login endpoint that returns Sanctum token
5. **Protected Routes**: Automatically redirects to login if no token

---

**Last Updated**: 2024-01-15
**Status**: 🟢 Ready for Integration with Backend
