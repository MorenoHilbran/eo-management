# Event Management System - Frontend Setup Guide

## Overview
A complete React + TypeScript frontend for the Event Management System with clean architecture, API integration, and reusable components.

## Project Structure

```
resources/js/
├── App.tsx                          # Main app with routing
├── main.tsx                         # React entry point
├── lib/
│   ├── api-client.ts               # Axios configuration with auth
│   └── services/                   # API service layer
│       ├── event.service.ts
│       ├── vendor.service.ts
│       ├── rab.service.ts
│       ├── proposal.service.ts
│       ├── transaction.service.ts
│       ├── sop.service.ts
│       └── index.ts
├── types/
│   └── api.ts                      # TypeScript interfaces for all models
├── hooks/
│   ├── useQuery.ts                 # Generic data fetching hooks
│   ├── useFormatters.ts            # Currency, date, status formatting
│   └── index.ts
├── components/
│   ├── common/                     # Reusable UI components
│   │   └── index.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   └── EventList.tsx
│   ├── rab/
│   │   ├── RABForm.tsx
│   │   └── RABTable.tsx
│   ├── vendors/
│   │   ├── VendorForm.tsx
│   │   └── VendorTable.tsx
│   ├── transactions/
│   │   ├── TransactionForm.tsx
│   │   └── TransactionTable.tsx
│   └── sop/
│       ├── SOPForm.tsx
│       └── SOPTable.tsx
├── layouts/
│   └── Layout.tsx                  # Main app layout with sidebar
├── pages/                          # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── EventsPage.tsx
│   ├── EventDetailPage.tsx
│   ├── VendorsPage.tsx
│   ├── TransactionsPage.tsx
│   └── SOPsPage.tsx
└── css/
    └── app.css                     # Tailwind CSS styles
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Required Packages
Make sure these packages are installed:
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.3"
  }
}
```

### 3. Environment Setup
Create `.env` file in project root:
```env
VITE_APP_NAME="Event Manager"
VITE_API_URL="http://localhost:8000/api"
```

### 4. Update Index HTML
Ensure your `public/index.html` contains:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Manager</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/resources/js/main.tsx"></script>
</body>
</html>
```

## Feature Overview

### Authentication
- Login page with email/password
- Sanctum token storage in localStorage
- Protected routes with ProtectedRoute component
- Automatic redirect to login if token expires

### Pages
1. **Dashboard**: Overview of events, statistics, quick actions
2. **Events**: List, create, edit, and delete events
3. **Event Detail**: View event details, manage RAB items, vendors, proposals
4. **Vendors**: Vendor management with categories
5. **Transactions**: Transaction approval workflow
6. **SOPs**: Standard Operating Procedures repository

### Components

#### Common Components
- `LoadingSkeleton`: Animated loading state
- `Badge`: Status badges with color variants
- `Button`: Reusable button component
- `Card`: Card wrapper component
- `Table`: Responsive table
- `Pagination`: Pagination controls
- `Modal`: Modal dialog
- `Input`: Form input field
- `ErrorMessage`: Error state display

#### Form Components
- `EventForm`: Create/edit event
- `RABForm`: Create/edit RAB items with auto-calculation
- `VendorForm`: Create/edit vendor with category
- `TransactionForm`: Create/edit transaction with approval
- `SOPForm`: Create/edit SOP

#### List Components
- `EventList`: Display events in table
- `VendorTable`: Vendor management table
- `TransactionTable`: Transaction management table
- `RABTable`: RAB items with summary

### API Services

All services follow a consistent pattern:
```typescript
// event.service.ts
export const eventService = {
    async getEvents(page = 1): Promise<Event[]> { ... }
    async getEvent(id: number): Promise<Event> { ... }
    async createEvent(data: CreateEventRequest): Promise<Event> { ... }
    async updateEvent(id: number, data: CreateEventRequest): Promise<Event> { ... }
    async deleteEvent(id: number): Promise<void> { ... }
    async getDashboardStats(): Promise<DashboardStats> { ... }
    async getRabTotal(eventId: number): Promise<RABTotal> { ... }
    async getBudgetStatus(eventId: number): Promise<BudgetStatus> { ... }
};
```

### Custom Hooks

#### Data Fetching
```typescript
// useQuery hook
const { data, loading, error, refetch } = useQuery<Event[]>(
    () => eventService.getEvents()
);

// usePaginatedQuery hook
const { data, loading, page, setPage, total } = usePaginatedQuery(
    (page) => eventService.getEvents(page)
);

// useMutation hook
const { mutate, loading } = useMutation(
    (data) => eventService.createEvent(data),
    { onSuccess: () => refetch() }
);
```

#### Formatters
```typescript
// useCurrency hook
const { format: formatCurrency } = useCurrency();
formatCurrency(10000); // "Rp10.000"

// useDateFormat hook
const { format: formatDate } = useDateFormat();
formatDate("2024-01-15"); // "15 Jan 2024"

// useStatusColor hook
const { getColor } = useStatusColor();
getColor("approved"); // Returns color class
```

## Running the Application

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Integration

### Base URL Configuration
The API client automatically uses the `VITE_API_URL` from environment variables.

### Token Management
Tokens are stored in `localStorage` under key `sanctum_token`:
```typescript
// Get token
const token = localStorage.getItem('sanctum_token');

// Set token
localStorage.setItem('sanctum_token', token);

// Clear token
localStorage.removeItem('sanctum_token');
```

### Error Handling
All API errors are caught and passed to the component's error state:
```typescript
const { error } = useQuery(...);
if (error) {
    return <ErrorMessage onRetry={refetch} />;
}
```

## Styling

### Tailwind CSS
All components use Tailwind CSS for styling. The `tailwindcss/vite` plugin is configured for automatic CSS purging.

### Color Palette
- Primary: `blue-600`
- Success: `green-600`
- Warning: `yellow-500`
- Danger: `red-600`
- Neutral: `gray-*`

## Best Practices

### Component Organization
1. Keep components small and focused
2. Use custom hooks for logic extraction
3. Extract form validation into separate functions
4. Use TypeScript for type safety

### State Management
1. Use React hooks for component state
2. Use API services for data fetching
3. Use custom hooks for shared logic
4. Consider Context API for global state (user, theme)

### API Calls
1. Always use the service layer
2. Use custom hooks for data fetching
3. Handle loading and error states
4. Provide user feedback for async operations

### Form Handling
1. Use controlled components
2. Validate before submission
3. Show validation errors inline
4. Disable submit button during submission

## Troubleshooting

### API Connection Issues
1. Verify `VITE_API_URL` is correct
2. Check CORS configuration in Laravel
3. Verify Sanctum token is being sent

### Authentication Issues
1. Check token is stored in localStorage
2. Verify token is not expired
3. Check Authorization header in API requests

### Build Issues
1. Clear node_modules and reinstall
2. Clear vite cache: `rm -rf .vite`
3. Check TypeScript errors: `npm run type-check`

## Next Steps

1. **Integrate with Backend**: Connect to your Laravel API
2. **Add State Management**: Implement Context API or Redux
3. **Enhance Forms**: Add client-side validation with React Hook Form
4. **Add Notifications**: Implement toast notifications
5. **Add Tests**: Set up Vitest or Jest
6. **Performance**: Implement code splitting and lazy loading
7. **Analytics**: Add analytics tracking
8. **PWA**: Convert to Progressive Web App

## Documentation Links

- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
