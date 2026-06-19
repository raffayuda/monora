# Tutorial Postman - Monora Backend API

Dokumen ini menjelaskan cara mengetes seluruh fitur backend melalui Postman, termasuk login, CRUD, dan upload gambar (via URL).

## 1) Prasyarat
- Server backend sudah berjalan di `http://localhost:5000`.
- Database sudah siap (migrasi/seed jika diperlukan).
- Jika ingin mengetes AI: set `GROQ_API_KEY` di environment backend.
- Jika ingin mengetes Contact: set `SMTP_EMAIL` dan `SMTP_PASSWORD` di environment backend.

## 2) Siapkan Environment di Postman
Buat Environment bernama `Monora Local` dengan variable:
- `baseUrl` = `http://localhost:5000`
- `token` = (kosong dulu, akan diisi setelah login)
- `eventId` = (opsional)
- `categoryId` = (opsional)
- `orderId` = (opsional)
- `refundId` = (opsional)
- `voucherId` = (opsional)
- `chatId` = (opsional)

Header global (di collection):
- `Content-Type: application/json`
- `Authorization: Bearer {{token}}`

Catatan:
- Header `Authorization` hanya dipakai untuk endpoint yang butuh login.

## 3) Health Check
**GET** `{{baseUrl}}/api/health`

Respons:
```json
{ "status": "ok" }
```

## 4) Auth
### 4.1 Register
**POST** `{{baseUrl}}/api/auth/register`

Body (JSON):
```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "password123",
  "phone": "08123456789",
  "role": "customer"
}
```

Role yang dipakai:
- `customer`
- `event_admin`
- `app_admin`

### 4.2 Login
**POST** `{{baseUrl}}/api/auth/login`

Body (JSON):
```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

Simpan token dari respons ke environment `token`.

### 4.3 Get Profile (Me)
**GET** `{{baseUrl}}/api/auth/me`

## 5) Users (app_admin)
### 5.1 List Users
**GET** `{{baseUrl}}/api/users`

### 5.2 Update Role
**PUT** `{{baseUrl}}/api/users/:id/role`

Body (JSON):
```json
{ "role": "event_admin" }
```

### 5.3 Toggle Status (aktif/nonaktif)
**PUT** `{{baseUrl}}/api/users/:id/toggle-status`

### 5.4 Delete User
**DELETE** `{{baseUrl}}/api/users/:id`

## 6) Categories (CRUD)
### 6.1 List Categories
**GET** `{{baseUrl}}/api/categories`

### 6.2 Create Category (app_admin)
**POST** `{{baseUrl}}/api/categories`

Body (JSON):
```json
{
  "name": "Concert",
  "icon": "music",
  "gradient": "orange"
}
```

### 6.3 Update Category (app_admin)
**PUT** `{{baseUrl}}/api/categories/:id`

Body (JSON):
```json
{
  "name": "Festival",
  "icon": "star",
  "gradient": "red"
}
```

### 6.4 Delete Category (app_admin)
**DELETE** `{{baseUrl}}/api/categories/:id`

## 7) Events (CRUD)
### 7.1 List Public Events
**GET** `{{baseUrl}}/api/events`

### 7.2 Get Event by ID/Slug
**GET** `{{baseUrl}}/api/events/:idOrSlug`

### 7.3 List My Events (event_admin/app_admin)
**GET** `{{baseUrl}}/api/events/admin/my-events`

### 7.4 List All Events (app_admin)
**GET** `{{baseUrl}}/api/events/admin/all`

### 7.5 Create Event (event_admin/app_admin)
**POST** `{{baseUrl}}/api/events`

Body (JSON):
```json
{
  "title": "Konser Musim Panas",
  "date": "Sabtu, 25 Mei 2026",
  "fullDate": "2026-05-25T19:00:00.000Z",
  "time": "19:00 - 22:00",
  "venue": "Stadion Merdeka",
  "city": "Jakarta",
  "province": "DKI Jakarta",
  "address": "Jl. Merdeka 1",
  "lat": -6.175392,
  "lng": 106.827153,
  "categoryId": 1,
  "image": "https://example.com/images/event-1.jpg",
  "thumbnail": "https://example.com/images/event-1-thumb.jpg",
  "description": "Konser besar dengan artis top.",
  "artist": "Band A",
  "organizer": "Monora Organizer",
  "status": "published",
  "hasMerch": true,
  "tags": ["konser", "music"],
  "tickets": [
    { "type": "VIP", "price": 500000, "description": "Duduk depan", "available": 50 },
    { "type": "Regular", "price": 200000, "description": "Duduk umum", "available": 300 }
  ],
  "merchandise": [
    {
      "name": "T-Shirt",
      "price": 150000,
      "image": "https://example.com/images/merch-1.jpg",
      "sizes": ["S", "M", "L"],
      "colors": ["Black", "White"],
      "stock": 100
    }
  ],
  "discount": { "percentage": 10, "label": "Early Bird" }
}
```

Catatan upload gambar:
- Backend tidak menerima upload file langsung.
- Field `image`, `thumbnail`, dan `merchandise[].image` berisi URL gambar.

### 7.6 Update Event (event_admin/app_admin)
**PUT** `{{baseUrl}}/api/events/:id`

Body sama seperti create (kirim field yang ingin diubah).

### 7.7 Delete Event (event_admin/app_admin)
**DELETE** `{{baseUrl}}/api/events/:id`

### 7.8 Add Discount
**POST** `{{baseUrl}}/api/events/:id/discount`

Body (JSON):
```json
{ "percentage": 15, "label": "Promo Mei" }
```

### 7.9 Remove Discount
**DELETE** `{{baseUrl}}/api/events/:id/discount`

## 8) Orders
### 8.1 Create Order (customer)
**POST** `{{baseUrl}}/api/orders`

Body (JSON):
```json
{
  "subtotal": 700000,
  "voucherCode": "PROMO10",
  "voucherDiscount": 70000,
  "serviceFee": 5000,
  "grandTotal": 635000,
  "deliveryMethod": "pickup",
  "deliveryAddress": { "address": "Jl. Contoh 1", "city": "Jakarta", "zipCode": "12345" },
  "customerInfo": { "name": "Budi", "email": "budi@example.com", "phone": "08123456789" },
  "items": [
    {
      "itemType": "ticket",
      "eventId": 1,
      "title": "VIP",
      "quantity": 2,
      "price": 500000,
      "originalPrice": 550000,
      "eventDate": "2026-05-25T19:00:00.000Z",
      "eventImage": "https://example.com/images/event-1.jpg"
    }
  ]
}
```

Catatan `deliveryMethod`:
- Nilai yang valid hanya: `pickup` atau `delivery`.
- Jika order hanya tiket digital (tanpa merch), kirim `deliveryMethod: null` atau jangan kirim field ini.

### 8.2 My Orders (customer)
**GET** `{{baseUrl}}/api/orders/my-orders`

### 8.3 List Orders (event_admin/app_admin)
**GET** `{{baseUrl}}/api/orders`

### 8.4 List Orders by Event (event_admin/app_admin)
**GET** `{{baseUrl}}/api/orders/event/:eventId`

### 8.5 Update Order Status (event_admin/app_admin)
**PUT** `{{baseUrl}}/api/orders/:id/status`

Body (JSON):
```json
{ "status": "confirmed" }
```

## 9) Refunds
### 9.1 Request Refund (customer)
**POST** `{{baseUrl}}/api/refunds`

Body (JSON):
```json
{ "orderId": "ORD-123456", "itemId": 1, "reason": "Salah beli" }
```

### 9.2 List Refunds (all roles, dengan filter by role)
**GET** `{{baseUrl}}/api/refunds`

### 9.3 Get Refund by Order Code
**GET** `{{baseUrl}}/api/refunds/order/:orderId`

### 9.4 Process Refund (event_admin/app_admin)
**PUT** `{{baseUrl}}/api/refunds/:id/process`

Body (JSON):
```json
{ "status": "approved" }
```

## 10) Vouchers
### 10.1 List Vouchers
**GET** `{{baseUrl}}/api/vouchers`

### 10.2 Create Voucher (event_admin/app_admin)
**POST** `{{baseUrl}}/api/vouchers`

Body (JSON):
```json
{
  "eventId": 1,
  "code": "PROMO10",
  "type": "percentage",
  "value": 10,
  "minPurchase": 100000,
  "maxUses": 100,
  "description": "Diskon 10%"
}
```

### 10.3 Update Voucher (event_admin/app_admin)
**PUT** `{{baseUrl}}/api/vouchers/:id`

Body (JSON):
```json
{ "value": 15, "isActive": true }
```

### 10.4 Delete Voucher (event_admin/app_admin)
**DELETE** `{{baseUrl}}/api/vouchers/:id`

### 10.5 Validate Voucher
**POST** `{{baseUrl}}/api/vouchers/validate`

Body (JSON):
```json
{
  "code": "PROMO10",
  "orderTotal": 700000,
  "eventIds": [1]
}
```

### 10.6 Use Voucher
**POST** `{{baseUrl}}/api/vouchers/use`

Body (JSON):
```json
{
  "code": "PROMO10",
  "orderId": "ORD-123456",
  "discountAmount": 70000
}
```

## 11) Chats
### 11.1 Send Message (customer)
**POST** `{{baseUrl}}/api/chats/send`

Body (JSON):
```json
{ "eventId": 1, "eventTitle": "Konser Musim Panas", "organizerName": "Monora Organizer", "message": "Halo, apakah ada dresscode?" }
```

### 11.2 My Chats (customer)
**GET** `{{baseUrl}}/api/chats/my-chats`

### 11.3 Chats by Event (event_admin/app_admin)
**GET** `{{baseUrl}}/api/chats/event/:eventId`

### 11.4 All Chats (event_admin/app_admin)
**GET** `{{baseUrl}}/api/chats/all`

### 11.5 Reply Chat (event_admin/app_admin)
**POST** `{{baseUrl}}/api/chats/:chatId/reply`

Body (JSON):
```json
{ "message": "Dresscode bebas, nyaman saja." }
```

### 11.6 Messages by Event (customer)
**GET** `{{baseUrl}}/api/chats/messages/:eventId`

## 12) AI Chat
**POST** `{{baseUrl}}/api/ai/chat`

Body (JSON contoh sesuai OpenAI-compatible payload):
```json
{
  "model": "llama3-8b-8192",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Ringkas event Monora." }
  ],
  "temperature": 0.7
}
```

Catatan:
- Endpoint ini memanggil Groq API. Pastikan `GROQ_API_KEY` sudah diset.

## 13) Contact
**POST** `{{baseUrl}}/api/contact`

Body (JSON):
```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "subject": "Kerjasama",
  "message": "Saya ingin kerjasama untuk event baru."
}
```

## 14) Tips Testing
- Untuk akses admin, gunakan user dengan role `event_admin` atau `app_admin`.
- Jika token expired, login ulang.
- Jika butuh data dummy, lakukan seeding database terlebih dulu.
