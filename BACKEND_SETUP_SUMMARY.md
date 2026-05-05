# Event Management System - Backend Setup Summary

## ✅ Completed Setup

### 1. Database Schema & Migrations
All migrations have been successfully created and executed:

#### Tables Created:
- **events** - Main event records
- **rab_items** - Budget items for events (RAB = Rencana Anggaran Biaya)
- **vendors** - Vendor database
- **vendor_categories** - Vendor categorization (Catering, Venue, Sound, etc.)
- **event_vendor** - Many-to-many relationship between events and vendors
- **proposals** - Event proposals with document tracking
- **transactions** - Budget transactions with approval workflow
- **sops** - Standard Operating Procedures documentation

### 2. Eloquent Models
All models created with proper relationships and fillable attributes:
- `Event.php` - Has many RABItems, Proposals, Transactions; Many-to-many Vendors
- `RABItem.php` - Belongs to Event
- `Vendor.php` - Belongs to VendorCategory; Many-to-many Events
- `VendorCategory.php` - Has many Vendors
- `Proposal.php` - Belongs to Event and User
- `Transaction.php` - Belongs to Event; Has creator and approver relationships
- `SOP.php` - Belongs to User (creator)
- `User.php` - Updated with relationships to Events, Proposals, Transactions, SOPs

### 3. API Controllers
All RESTful controllers implemented with full CRUD operations:
- `EventController` - Events management + dashboard stats
- `VendorController` - Vendor management
- `VendorCategoryController` - Category management with validation
- `RABItemController` - Budget items + automatic total calculation
- `ProposalController` - Document lifecycle (draft → sent → signed)
- `TransactionController` - Budget control with approval workflow
- `SOPController` - Document repository with category filtering

### 4. API Routes
43 routes registered covering all CRUD operations plus special actions:
```
Base URL: http://localhost:8000/api

Authentication: Required (Sanctum)
Response Format: JSON
Pagination: 15 items per page (configurable)
```

### 5. Database Seeders
Initial data populated:
- ✅ 10 vendor categories seeded (Catering, Venue, Sound, Lighting, etc.)
- ✅ Test user created

---

## 📋 Database Schema Details

### Events Table
```sql
- id (primary key)
- name (string)
- description (text, nullable)
- event_date (datetime)
- location (string)
- budget (decimal 15,2)
- status (enum: planning, ongoing, completed, cancelled)
- created_by (foreign key → users)
- timestamps
```

### RAB Items Table
```sql
- id (primary key)
- event_id (foreign key → events)
- name (string)
- unit (string)
- quantity (integer)
- unit_price (decimal 15,2)
- total_price (decimal 15,2) [auto-calculated]
- notes (text, nullable)
- timestamps
```

### Vendors Table
```sql
- id (primary key)
- name (string)
- category_id (foreign key → vendor_categories)
- contact_person (string)
- email (string, nullable)
- phone (string, nullable)
- address (text, nullable)
- rating (decimal 3,2)
- status (enum: active, inactive)
- timestamps
```

### Transactions Table
```sql
- id (primary key)
- event_id (foreign key → events)
- amount (decimal 15,2)
- description (text)
- status (enum: pending, approved, rejected)
- transaction_date (datetime)
- created_by (foreign key → users)
- approved_by (foreign key → users, nullable)
- approved_at (datetime, nullable)
- rejection_reason (text, nullable)
- timestamps
```

### Proposals Table
```sql
- id (primary key)
- event_id (foreign key → events)
- template_name (string)
- content (text, nullable)
- status (enum: sent, signed, expired, draft, rejected)
- created_by (foreign key → users)
- sent_at (datetime, nullable)
- signed_at (datetime, nullable)
- expires_at (datetime, nullable)
- signature_file (string, nullable)
- timestamps
```

### SOPs Table
```sql
- id (primary key)
- name (string)
- category (string)
- description (text, nullable)
- content (text)
- file_path (string, nullable)
- created_by (foreign key → users)
- timestamps
```

---

## 🔧 API Features Implemented

### Dashboard
- **GET /api/dashboard/stats** - Event overview and budget summary

### Events Management
- Full CRUD operations
- Event status lifecycle tracking
- Budget tracking per event

### RAB Generator
- Automatic total price calculation (quantity × unit_price)
- Margin calculation endpoint (15% default)
- Total cost summary by event

### Budget Control
- Transaction creation with pending status
- Approval/rejection workflow
- Budget status endpoint showing:
  - Total budget
  - Amount spent (approved transactions)
  - Pending amount
  - Remaining amount
  - Budget alert flag (< 20% remaining)

### Proposal Management
- Multi-status lifecycle (draft → sent → signed → expired)
- Document tracking
- Signature file storage support

### Vendor Management
- Categorized vendor database
- Performance rating system
- Work history tracking
- Active/inactive status

### SOP Management
- Document repository
- Category-based filtering
- Creator attribution

---

## 🔐 Authentication & Authorization

Current Setup:
- Laravel Sanctum for API authentication
- User model supports multiple guard types
- All API endpoints protected by `auth:sanctum` middleware
- Future: Implement role-based access control (RBAC)

Current test user credentials:
```
Email: test@example.com
Password: (generated via factory)
```

---

## 📝 Vendor Categories Seeded

1. Catering - Food and beverage services
2. Venue - Event venue and location
3. Sound & Audio - Sound system and audio equipment
4. Lighting - Lighting and visual effects
5. Decoration - Decoration and arrangement
6. Photography - Photography and videography
7. Transportation - Transportation services
8. Security - Security services
9. Entertainment - Entertainment and performers
10. Printing - Printing and promotional materials

---

## 🚀 Running the Application

### Development Server
```bash
php artisan serve
```

### Run Migrations
```bash
php artisan migrate
```

### Seed Database
```bash
php artisan db:seed
```

### Reset Database
```bash
php artisan migrate:refresh --seed
```

---

## 📚 Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md` for detailed endpoint specifications
- **Status Values**: Each module uses specific enum statuses (see API docs)
- **Decimal Precision**: All monetary amounts use decimal(15,2) for currency precision
- **Timestamps**: All dates returned in ISO 8601 format with UTC timezone

---

## 🎯 Next Steps (Frontend Integration)

1. Set up React components for each module
2. Create forms for data entry
3. Implement dashboard charts and visualizations
4. Add authentication UI
5. Build RAB export functionality (PDF/Excel)
6. Implement proposal signature capture
7. Create budget alerts notification system

---

## 📋 Checklist

- ✅ Database migrations created and executed
- ✅ Eloquent models with relationships
- ✅ All controllers implemented
- ✅ API routes registered (43 total)
- ✅ Authentication middleware configured
- ✅ Seeders for initial data
- ✅ Error handling in controllers
- ✅ Request validation
- ✅ API documentation created
- ⏳ Frontend components (pending)
- ⏳ E2E testing (pending)
- ⏳ Role-based access control (pending)

---

**Created**: May 5, 2026
**Backend Status**: ✅ Ready for Frontend Integration
