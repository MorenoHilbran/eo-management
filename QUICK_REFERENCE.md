# Event Management System - Quick Reference Guide

## 🚀 Getting Started

### Start Development Server
```bash
php artisan serve
```
Server runs at `http://localhost:8000`

### Access API
All endpoints are prefixed with `/api/` and require authentication.

**Example Request:**
```bash
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/events
```

---

## 📋 Core Modules

### 1️⃣ Events Management
**Endpoint**: `/api/events`

Create an event:
```bash
POST /api/events
{
  "name": "Corporate Conference",
  "event_date": "2026-06-20 09:00:00",
  "location": "Convention Center",
  "budget": 100000000
}
```

### 2️⃣ RAB Generator
**Endpoint**: `/api/rab-items`

Add budget items:
```bash
POST /api/rab-items
{
  "event_id": 1,
  "name": "Catering",
  "unit": "person",
  "quantity": 200,
  "unit_price": 150000
}
```

Get budget summary:
```bash
GET /api/events/1/rab-total
```

### 3️⃣ Budget Control
**Endpoint**: `/api/transactions`

Create transaction request:
```bash
POST /api/transactions
{
  "event_id": 1,
  "amount": 5000000,
  "description": "Sound equipment rental",
  "transaction_date": "2026-05-05"
}
```

Approve transaction:
```bash
POST /api/transactions/1/approve
```

Get budget status:
```bash
GET /api/events/1/budget-status
```

### 4️⃣ Vendor Management
**Endpoint**: `/api/vendors`

Add vendor:
```bash
POST /api/vendors
{
  "name": "ABC Catering",
  "category_id": 1,
  "contact_person": "John Doe",
  "email": "john@abc-catering.com",
  "phone": "081234567890"
}
```

### 5️⃣ Proposals
**Endpoint**: `/api/proposals`

Create proposal:
```bash
POST /api/proposals
{
  "event_id": 1,
  "template_name": "Standard Event Proposal",
  "content": "Proposal details...",
  "expires_at": "2026-06-01"
}
```

Send proposal:
```bash
POST /api/proposals/1/send
```

Sign proposal:
```bash
POST /api/proposals/1/sign
```

### 6️⃣ SOPs
**Endpoint**: `/api/sops`

Create SOP:
```bash
POST /api/sops
{
  "name": "Event Planning Checklist",
  "category": "Planning",
  "content": "1. Define scope\n2. Set budget\n3. Plan timeline"
}
```

---

## 🗂️ Database Relations

```
Event
  ├─ creator (User)
  ├─ RABItems (many)
  ├─ Proposals (many)
  ├─ Transactions (many)
  └─ Vendors (many-to-many via event_vendor)

Vendor
  ├─ category (VendorCategory)
  └─ Events (many-to-many via event_vendor)

User
  ├─ Events (many)
  ├─ Proposals (many)
  ├─ Transactions (many)
  └─ SOPs (many)
```

---

## 🔑 Key Status Values

| Module | Statuses |
|--------|----------|
| **Event** | planning, ongoing, completed, cancelled |
| **Transaction** | pending, approved, rejected |
| **Proposal** | draft, sent, signed, expired, rejected |
| **Vendor** | active, inactive |

---

## 💡 Common Workflows

### Workflow 1: Plan New Event
1. Create event: `POST /api/events`
2. Add RAB items: `POST /api/rab-items`
3. Get total cost: `GET /api/events/{id}/rab-total`
4. Create proposal: `POST /api/proposals`

### Workflow 2: Request Budget Approval
1. Create transaction: `POST /api/transactions`
2. Owner approves: `POST /api/transactions/{id}/approve`
3. Or rejects: `POST /api/transactions/{id}/reject`

### Workflow 3: Manage Vendors
1. View categories: `GET /api/vendor-categories`
2. Add vendor: `POST /api/vendors`
3. Rate vendor: `PUT /api/vendors/{id}` (rating field)

### Workflow 4: Track Event Progress
1. Get dashboard: `GET /api/dashboard/stats`
2. Check budget: `GET /api/events/{id}/budget-status`
3. List proposals: `GET /api/proposals?event_id={id}`

---

## 🧪 Quick Testing

### List Endpoints
```bash
php artisan route:list --path=api
```

### Access Tinker Shell
```bash
php artisan tinker
```

### Test Queries (in Tinker)
```php
# Count events
App\Models\Event::count()

# Get first event with relationships
App\Models\Event::with('rabItems', 'vendors')->first()

# Count vendor categories
App\Models\VendorCategory::count()

# Get all transactions for event #1
App\Models\Transaction::where('event_id', 1)->get()
```

---

## 📊 Dashboard Metrics

**GET /api/dashboard/stats**
Returns:
- `total_events` - Total events in system
- `ongoing_events` - Events with status "ongoing"
- `completed_events` - Events with status "completed"
- `total_budget` - Sum of all event budgets

---

## 🔐 Authentication

### Get Token (Example with Fortify)
After login, you receive a token. Include it in requests:
```
Authorization: Bearer {your-token}
```

### Without Token
All API requests will return `401 Unauthorized`

---

## ⚡ Performance Tips

1. **Pagination** - List endpoints return 15 items per page
   - Add query param: `?page=2`

2. **Filtering** - Use query parameters:
   - Transactions: `?event_id=1&status=pending`
   - RAB Items: `?event_id=1`
   - SOPs: `?category=Planning`

3. **Eager Loading** - Controllers use `with()` to load relationships

---

## 📱 Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No content (deleted) |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 422 | Validation failed |
| 500 | Server error |

---

## 🔗 Related Files

- **Full API Docs**: `API_DOCUMENTATION.md`
- **Backend Summary**: `BACKEND_SETUP_SUMMARY.md`
- **Models**: `app/Models/*.php`
- **Controllers**: `app/Http/Controllers/Api/*.php`
- **Routes**: `routes/api.php`

---

**Last Updated**: May 5, 2026
