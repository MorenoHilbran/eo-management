# Event Management System - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All API endpoints require authentication using Sanctum tokens. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints Overview

### Dashboard
- **GET** `/dashboard/stats` - Get event statistics (total, ongoing, completed events, total budget)

### Events
- **GET** `/events` - List all events (paginated, 15 per page)
- **POST** `/events` - Create a new event
- **GET** `/events/{id}` - Get event details with related data
- **PUT** `/events/{id}` - Update event
- **DELETE** `/events/{id}` - Delete event

### Vendor Categories
- **GET** `/vendor-categories` - List all vendor categories (paginated)
- **POST** `/vendor-categories` - Create new category
- **GET** `/vendor-categories/{id}` - Get category details with vendors
- **PUT** `/vendor-categories/{id}` - Update category
- **DELETE** `/vendor-categories/{id}` - Delete category (only if no vendors)

### Vendors
- **GET** `/vendors` - List all vendors (paginated)
- **POST** `/vendors` - Create new vendor
- **GET** `/vendors/{id}` - Get vendor details with events
- **PUT** `/vendors/{id}` - Update vendor
- **DELETE** `/vendors/{id}` - Delete vendor

### RAB Items (Budget Items)
- **GET** `/rab-items?event_id={id}` - List RAB items (optionally filter by event)
- **POST** `/rab-items` - Create new RAB item (auto-calculates total price)
- **GET** `/rab-items/{id}` - Get RAB item details
- **PUT** `/rab-items/{id}` - Update RAB item
- **DELETE** `/rab-items/{id}` - Delete RAB item
- **GET** `/events/{event_id}/rab-total` - Calculate total cost, margin, and total with margin

### Proposals
- **GET** `/proposals?event_id={id}` - List proposals (optionally filter by event)
- **POST** `/proposals` - Create new proposal
- **GET** `/proposals/{id}` - Get proposal details
- **PUT** `/proposals/{id}` - Update proposal
- **DELETE** `/proposals/{id}` - Delete proposal
- **POST** `/proposals/{id}/send` - Send proposal (sets status to 'sent')
- **POST** `/proposals/{id}/sign` - Sign proposal (sets status to 'signed')

### Transactions
- **GET** `/transactions?event_id={id}&status={status}` - List transactions (with optional filters)
- **POST** `/transactions` - Create new transaction (status defaults to 'pending')
- **GET** `/transactions/{id}` - Get transaction details
- **PUT** `/transactions/{id}` - Update transaction
- **DELETE** `/transactions/{id}` - Delete transaction (only if pending)
- **POST** `/transactions/{id}/approve` - Approve transaction
- **POST** `/transactions/{id}/reject` - Reject transaction with reason
- **GET** `/events/{event_id}/budget-status` - Get budget summary (spent, pending, remaining, alert status)

### SOPs (Standard Operating Procedures)
- **GET** `/sops?category={category}` - List SOPs (optionally filter by category)
- **POST** `/sops` - Create new SOP
- **GET** `/sops/{id}` - Get SOP details
- **PUT** `/sops/{id}` - Update SOP
- **DELETE** `/sops/{id}` - Delete SOP
- **GET** `/sops/categories/list` - Get list of all SOP categories

---

## Request/Response Examples

### Create Event
```json
POST /events
{
  "name": "Wedding Reception",
  "description": "Grand wedding reception event",
  "event_date": "2026-06-15 19:00:00",
  "location": "Grand Hotel Ballroom",
  "budget": 50000000,
  "status": "planning"
}

Response (201):
{
  "id": 1,
  "name": "Wedding Reception",
  "description": "Grand wedding reception event",
  "event_date": "2026-06-15T19:00:00.000000Z",
  "location": "Grand Hotel Ballroom",
  "budget": "50000000.00",
  "status": "planning",
  "created_by": 1,
  "created_at": "2026-05-05T04:10:00.000000Z",
  "updated_at": "2026-05-05T04:10:00.000000Z",
  "creator": {...}
}
```

### Create RAB Item
```json
POST /rab-items
{
  "event_id": 1,
  "name": "Catering Service",
  "unit": "person",
  "quantity": 150,
  "unit_price": 250000,
  "notes": "All meals included"
}

Response (201):
{
  "id": 1,
  "event_id": 1,
  "name": "Catering Service",
  "unit": "person",
  "quantity": 150,
  "unit_price": "250000.00",
  "total_price": "37500000.00",
  "notes": "All meals included",
  "created_at": "2026-05-05T04:12:00.000000Z",
  "updated_at": "2026-05-05T04:12:00.000000Z"
}
```

### Get Budget Status
```json
GET /events/1/budget-status

Response (200):
{
  "event_id": 1,
  "budget": "50000000.00",
  "spent": "37500000.00",
  "pending": "5000000.00",
  "remaining": "12500000.00",
  "budget_alert": false
}
```

### Approve Transaction
```json
POST /transactions/1/approve

Response (200):
{
  "id": 1,
  "event_id": 1,
  "amount": "2000000.00",
  "description": "Sound system rental",
  "status": "approved",
  "transaction_date": "2026-05-05T00:00:00.000000Z",
  "created_by": 1,
  "approved_by": 1,
  "approved_at": "2026-05-05T04:15:00.000000Z",
  "rejection_reason": null,
  "created_at": "2026-05-05T04:14:00.000000Z",
  "updated_at": "2026-05-05T04:15:00.000000Z"
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Can only delete pending transactions"
}
```

### 404 Not Found
```json
{
  "message": "Not found"
}
```

### 422 Unprocessable Entity
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "event_id": ["The event id field is required."],
    "amount": ["The amount must be at least 0."]
  }
}
```

---

## Status Values

### Event Status
- `planning` - Event being planned
- `ongoing` - Event is happening
- `completed` - Event finished
- `cancelled` - Event cancelled

### Transaction Status
- `pending` - Awaiting approval
- `approved` - Transaction approved
- `rejected` - Transaction rejected

### Proposal Status
- `draft` - Initial draft
- `sent` - Sent to client
- `signed` - Client signed
- `expired` - Proposal expired
- `rejected` - Client rejected

### Vendor Status
- `active` - Vendor available
- `inactive` - Vendor unavailable

---

## Pagination
All list endpoints return paginated results:
```json
{
  "data": [...],
  "links": {
    "first": "http://localhost:8000/api/vendors?page=1",
    "last": "http://localhost:8000/api/vendors?page=2",
    "next": "http://localhost:8000/api/vendors?page=2",
    "prev": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 2,
    "path": "http://localhost:8000/api/vendors",
    "per_page": 15,
    "to": 15,
    "total": 20
  }
}
```

---

## Notes
- All monetary amounts are in IDR (Indonesian Rupiah) and stored as decimal(15,2)
- Dates are returned in ISO 8601 format with UTC timezone
- Authentication token should be obtained from the login endpoint (Fortify)
- RAB item total price is automatically calculated based on quantity × unit_price
- Budget alerts are triggered when remaining budget < 20% of total budget
