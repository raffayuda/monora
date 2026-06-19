# SPRINT 7 REPORT - Backend
**Periode:** 23-30 April 2026  
**Product:** Monora - Aplikasi Event & Konser Online dengan Sistem Pembelian Tiket + Merchandise

---

## Ringkasan Sprint 7

| Aspek | Detail |
|-------|--------|
| **Total Mandays (Estimation)** | 5 |
| **Total Mandays (Realization)** | 5 |
| **Total Story Points** | 6.5 |
| **Status** | ✅ Done |

---

## Tim Pengembang Backend

| No | Nama | NPM | Role | Fitur yang Dikerjakan |
|----|------|-----|------|----------------------|
| 1 | Raffa Yuda Pratama | 0110224081 | Developer | Upload Gambar Events & Merchandise Sizes |
| 2 | Muhammad Zakri Alfiansyah | 0110224153 | Developer | Chat Conversation Table |
| 3 | Afrid Ahira Mulya | 0110224238 | Developer | Memperbaiki Voucher Usages |
| 4 | Aan Adriyana | 0110224014 | Developer | Membuat Endpoint Profile |

---

## Detail Fitur yang Dikerjakan

### ✅ Fitur 1: Upload Gambar Events & Merchandise Sizes
**PIC:** Raffa Yuda Pratama (RAF)  
**Status:** Done  
**Story Points:** 3.5  
**Mandays:** 2

#### Deskripsi
Implementasi fitur upload/management gambar untuk events serta pengelolaan merchandise sizes. Fitur ini memungkinkan event organizer untuk menambahkan gambar event (image & thumbnail) dan mendefinisikan berbagai ukuran (sizes) untuk produk merchandise.

#### File-File yang Dimodifikasi/Dibuat

##### 1. **EventService.js**
`backend/src/services/EventService.js`

**Fungsi yang Diimplementasikan:**

a) **normalizeEventPayload()** - Handling image URLs
```javascript
normalizeEventPayload(data, userId, existing = null, categoryId = null) {
  return {
    // ... field lainnya
    image_url: data.image ?? data.image_url ?? existing?.image_url ?? null,
    thumbnail_url: data.thumbnail ?? data.thumbnail_url ?? existing?.thumbnail_url ?? null,
    // ... field lainnya
  }
}
```

Fitur:
- Accept image URLs dari frontend/Postman
- Support update image tanpa perlu re-upload
- Preserve existing image jika tidak dikirim field baru

b) **syncMerchandise()** & **syncMerchandiseSizes()** - Merchandise Sizes Management
```javascript
async syncMerchandise(eventId, merchandise) {
  // ... create merchandise
  if (m.sizes?.length) {
    await this.eventModel.createMerchandiseSizes(
      m.sizes.map((s) => ({ merch_id: merch.id, size_name: s }))
    )
  }
  // ... create colors
}
```

Fitur:
- Create merchandise dengan multiple sizes (S, M, L, XL, dll)
- Update sizes ketika event diupdate
- Delete existing sizes sebelum create yang baru

##### 2. **EventModel.js**
`backend/src/models/EventModel.js`

**Fungsi-Fungsi yang Diimplementasikan:**

```javascript
createMerchandise(data)           // Create merchandise dengan image_url
createMerchandiseSizes(items)     // Batch create merchandise sizes
clearMerchandise(eventId)         // Delete semua merchandise untuk event
```

Merchandise Sizes Schema:
- Tabel: `merchandiseSize`
- Fields: `merch_id`, `size_name`, `created_at`
- Support berbagai ukuran standar: S, M, L, XL, XXL, dll

##### 3. **EventController.js**
`backend/src/controllers/EventController.js`

**Endpoints yang Digunakan:**
- `POST /api/events` - Create event dengan image, thumbnail, dan merchandise sizes
- `PUT /api/events/:id` - Update event dengan image/thumbnail baru

#### Database Schema Terkait

**Tabel yang Digunakan:**
- `event` - Fields: `image_url`, `thumbnail_url`
- `merchandise` - Fields: `image_url`, `price`, `stock`
- `merchandiseSize` - Menyimpan varian ukuran merchandise

#### Endpoint Usage Examples

**POST** `/api/events` - Create Event dengan Images & Merchandise Sizes

**Request Body:**
```json
{
  "title": "Konser Musim Panas",
  "image": "https://example.com/images/event-1.jpg",
  "thumbnail": "https://example.com/images/event-1-thumb.jpg",
  "hasMerch": true,
  "merchandise": [
    {
      "name": "T-Shirt",
      "price": 150000,
      "image": "https://example.com/images/merch-1.jpg",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "White"],
      "stock": 100
    }
  ]
}
```

**Response Success (201):**
```json
{
  "id": 1,
  "title": "Konser Musim Panas",
  "image": "https://example.com/images/event-1.jpg",
  "thumbnail": "https://example.com/images/event-1-thumb.jpg",
  "merchandise": [
    {
      "id": 1,
      "name": "T-Shirt",
      "price": 150000,
      "image": "https://example.com/images/merch-1.jpg",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Black", "White"],
      "stock": 100
    }
  ]
}
```

#### Features & Validations

✅ **Event Image Management:**
- Support URL-based images (no file upload to backend)
- Separate image & thumbnail handling
- Update image tanpa perlu update field lain
- Preserve image jika tidak di-update

✅ **Merchandise Sizes:**
- CRUD operations untuk sizes
- Multi-size support dalam satu merchandise
- Sizes terintegrasi dengan update event
- Size name flexibility (custom sizes supported)

✅ **Error Handling:**
- Validasi URL format untuk images
- Size name validation
- Database constraint enforcement

---

### ✅ Fitur 2: Chat Conversation Table
**PIC:** Muhammad Zakri Alfiansyah (ALF)  
**Status:** Done  
**Story Points:** 1  
**Mandays:** 1

#### Deskripsi
Implementasi database schema dan model untuk chat conversation system. Fitur ini menyediakan infrastruktur untuk customer-organizer communication dengan message history tracking dan conversation management.

#### File-File yang Dimodifikasi/Dibuat

##### 1. **ChatModel.js** - Database Operations
`backend/src/models/ChatModel.js`

**Fungsi yang Diimplementasikan:**

```javascript
// Conversation Operations
findConversationByUserAndEvent(userId, eventId)
  - Find conversation dengan unique constraint: user_id + event_id
  - Support untuk prevent duplicate conversation

createConversation(data)
  - Create new chat conversation
  - Fields: user_id, event_id, user_name, event_title, organizer_name

findConversationWithMessagesById(id)
  - Get conversation dengan semua messages
  - Include user data dan order messages chronologically

touchConversation(id)
  - Update updated_at timestamp
  - Trigger saat ada message baru

// Message Operations  
createMessage(data)
  - Create individual message
  - Fields: conversation_id, sender, message_text, created_at
  - Sender: 'customer' atau 'organizer'

// Query Operations
listMyChats(userId)
  - Get semua conversations untuk user (customer view)
  - Order by updated_at DESC (recent first)

listByEventId(eventId)
  - Get semua conversations untuk event (organizer view)
  - Order by updated_at DESC

listAll(where)
  - Get all conversations dengan optional filtering
  - Support role-based access control

findMessagesForUserEvent(userId, eventId)
  - Get message history untuk user di event tertentu
  - Used untuk fetch message history view
```

##### 2. **Prisma Schema** - Database Tables
`backend/prisma/schema.prisma`

**Tabel chatConversation:**
```prisma
model chatConversation {
  id              BigInt    @id @default(autoincrement())
  user_id         BigInt
  event_id        BigInt
  user_name       String?   
  event_title     String?   
  organizer_name  String?   
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
  
  user            user      @relation(fields: [user_id], references: [id])
  event           event     @relation(fields: [event_id], references: [id])
  messages        chatMessage[]
  
  @@unique([user_id, event_id])  // One conversation per user-event pair
  @@map("chat_conversation")
}
```

**Tabel chatMessage:**
```prisma
model chatMessage {
  id              BigInt          @id @default(autoincrement())
  conversation_id BigInt
  sender          String          // 'customer' atau 'organizer'
  message_text    String          @db.Text
  created_at      DateTime        @default(now())
  
  conversation    chatConversation @relation(fields: [conversation_id], references: [id], onDelete: Cascade)
  
  @@map("chat_message")
}
```

#### Database Constraints & Relationships

✅ **Unique Constraint:**
- `chatConversation` memiliki unique constraint pada `(user_id, event_id)`
- Mencegah duplicate conversations
- Support find-or-create pattern secara atomik

✅ **Cascade Delete:**
- Ketika conversation didelete, semua messages otomatis terhapus
- Data integrity maintained

✅ **Timestamp Tracking:**
- `created_at`: Kapan conversation pertama dibuat
- `updated_at`: Kapan conversation terakhir diakses/updated
- Used untuk sort "recent conversations first"

#### Features

✅ **Conversation Management:**
- One conversation per user-event pair (enforced by unique constraint)
- Automatic find-or-create pattern support
- Timestamp tracking untuk activity monitoring

✅ **Message Organization:**
- Chronological message ordering (by created_at ASC)
- Sender identification (customer/organizer)
- Message text storage (TEXT type untuk large messages)

✅ **Data Integrity:**
- Foreign key constraints untuk user dan event
- Cascade delete untuk messages
- Required fields validation

✅ **Query Optimization:**
- Indexed queries pada user_id dan event_id
- Efficient conversation lookup dengan unique constraint
- Pre-ordered results untuk UI display

---

### ✅ Fitur 3: Memperbaiki Voucher Usages
**PIC:** Afrid Ahira Mulya (AFR)  
**Status:** Done  
**Story Points:** 1  
**Mandays:** 1

#### Deskripsi
Implementasi sistem tracking penggunaan voucher untuk mencatat setiap penggunaan voucher dalam transaksi order. Fitur ini memastikan bahwa setiap voucher yang digunakan tercatat dengan baik di database.

#### File-File yang Dimodifikasi/Dibuat

##### 1. **VoucherModel.js** 
`backend/src/models/VoucherModel.js`

**Fungsi Baru:**
- `createVoucherUsage(data)` - Membuat record penggunaan voucher di tabel `voucherUsage`

```javascript
createVoucherUsage(data) {
  return this.prisma.voucherUsage.create({ data })
}
```

**Fungsi Pendukung yang Digunakan:**
- `incrementUsage(id)` - Increment counter `used_count` pada voucher ketika voucher digunakan
- `findByCode(code)` - Mencari voucher berdasarkan kode
- `findOrderByCode(orderCode)` - Mencari order berdasarkan kode order

##### 2. **VoucherService.js**
`backend/src/services/VoucherService.js`

**Fungsi yang Diimplementasikan:**
- `useVoucher(userId, payload)` - Proses menggunakan voucher pada order
  - Validasi kode voucher ada/aktif
  - Validasi jumlah penggunaan maksimal belum tercapai
  - Validasi minimal pembelian terpenuhi
  - Increment counter penggunaan
  - Create record di `voucherUsage` table untuk audit trail

#### Endpoint yang Tersedia

**POST** `/api/vouchers/use`

**Request Body:**
```json
{
  "code": "PROMO10",
  "orderId": "ORD-123456",
  "discountAmount": 70000
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Voucher applied successfully",
  "discountAmount": 70000
}
```

**Response Error (400/403):**
```json
{
  "error": "Voucher code already used maximum times"
}
```

#### Database Schema Terkait
Tabel yang digunakan:
- `voucher` - Menyimpan data voucher (code, type, value, min_purchase, max_uses, used_count, etc.)
- `voucherUsage` - Menyimpan audit trail penggunaan voucher (voucher_id, order_id, user_id, discount_amount, created_at)

---

### ✅ Fitur 4: Membuat Endpoint Profile
**PIC:** Aan Adriyana (AAN)  
**Status:** Done  
**Story Points:** 1  
**Mandays:** 1

#### Deskripsi
Implementasi endpoint profile untuk mendapatkan informasi profil user yang sedang login. Endpoint ini berfungsi untuk menampilkan data profil lengkap user termasuk nama, email, phone, dan role.

#### File-File yang Dimodifikasi/Dibuat

##### 1. **AuthController.js**
`backend/src/controllers/AuthController.js`

**Fungsi yang Diimplementasikan:**
- `me()` - Handler untuk mendapatkan profil user yang sedang login

```javascript
me = async (req, res) => {
  const user = await this.authService.getProfile(req.user.id)
  res.json(user)
}
```

##### 2. **AuthService.js**
`backend/src/services/AuthService.js`

**Fungsi yang Diimplementasikan:**
- `getProfile(userId)` - Mengambil data profil user dari database
  - Mencari user berdasarkan ID
  - Format response sesuai kebutuhan frontend
  - Return data: id, name, email, phone, role, isActive, createdAt

#### 3. **auth.js** (Routes)
`backend/src/routes/auth.js`

**Route yang Ditambahkan:**
```javascript
router.get('/me', authenticate, asyncHandler(controller.me))
```

#### Endpoint yang Tersedia

**GET** `/api/auth/me`

**Header:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Response Success (200):**
```json
{
  "id": 1,
  "name": "Budi",
  "email": "budi@example.com",
  "phone": "08123456789",
  "role": "customer",
  "isActive": true,
  "createdAt": "2026-04-23T10:30:00.000Z"
}
```

**Response Error (401 - Unauthorized):**
```json
{
  "error": "Please login first"
}
```

**Response Error (404 - Not Found):**
```json
{
  "error": "User not found"
}
```

#### Authentication
- Endpoint ini **memerlukan** token JWT di header `Authorization`
- Token didapatkan dari proses login di endpoint `POST /api/auth/login`
- Middleware `authenticate` akan memverifikasi token dan attach user data ke `req.user`

#### Use Case
- **Frontend:** Menampilkan informasi profil user setelah login
- **Navigation:** Menampilkan nama user di navbar/header
- **Admin Panel:** Verifikasi data user sebelum akses ke dashboard admin
- **Personalization:** Customize tampilan aplikasi berdasarkan data user

---

## Ringkasan Perubahan Kode

### Struktur Direktori Backend yang Terlibat
```
backend/
├── src/
│   ├── controllers/
│   │   ├── EventController.js       (Fitur 1)
│   │   ├── ChatController.js        (Fitur 2)
│   │   ├── VoucherController.js     (Fitur 3)
│   │   └── AuthController.js        (Fitur 4)
│   ├── services/
│   │   ├── EventService.js          (Fitur 1)
│   │   ├── ChatService.js           (Fitur 2)
│   │   ├── VoucherService.js        (Fitur 3)
│   │   └── AuthService.js           (Fitur 4)
│   ├── models/
│   │   ├── EventModel.js            (Fitur 1)
│   │   ├── ChatModel.js             (Fitur 2)
│   │   └── VoucherModel.js          (Fitur 3)
│   └── routes/
│       ├── events.js                (Fitur 1)
│       ├── chats.js                 (Fitur 2)
│       ├── vouchers.js              (Fitur 3)
│       └── auth.js                  (Fitur 4)
└── prisma/
  └── schema.prisma                (Fitur 2 - Tables)
```

### Total Lines of Code Added
- **EventService.js & EventModel.js:** Image & Merchandise Sizes (~80 lines)
- **ChatModel.js:** Conversation & Message handling (~70 lines)
- **Prisma Schema:** Chat tables (~40 lines)
- **VoucherModel.js & VoucherService.js:** Voucher tracking (~33 lines)
- **AuthController.js & AuthService.js:** Profile endpoint (~14 lines)
- **Routes:** Endpoint registrations (~10 lines)

**TOTAL BACKEND CODE:** ~250 lines

---

## Testing Checklist

### Fitur 1: Upload Gambar Events & Merchandise Sizes

- [ ] Endpoint `POST /api/events` menerima field image dan thumbnail
- [ ] Image URLs tersimpan di database dengan benar
- [ ] Update event dapat mengubah image tanpa update field lain
- [ ] Merchandise dengan sizes array tersimpan dengan benar
- [ ] Merchandise sizes tersimpan di tabel merchandiseSize
- [ ] Multiple sizes dalam satu merchandise di-support
- [ ] Update event menghapus existing sizes dan create yang baru (clear & recreate)
- [ ] Response mengembalikan full merchandise dengan sizes array
- [ ] Error handling untuk invalid image URLs
- [ ] Event admin tidak bisa modify events dari user lain

### Fitur 2: Chat Conversation Table

- [ ] Table chatConversation tersimpan di database dengan benar
- [ ] Table chatMessage tersimpan di database dengan benar
- [ ] Unique constraint (user_id, event_id) prevent duplicate conversations
- [ ] Foreign key relationships terimplementasi
- [ ] Message messages ordered chronologically (created_at ASC)
- [ ] Cascade delete works: delete conversation deletes messages
- [ ] findConversationByUserAndEvent berfungsi dengan unique constraint
- [ ] listMyChats returns conversations ordered by updated_at DESC
- [ ] listByEventId returns event's conversations with correct filtering
- [ ] timestamp created_at dan updated_at terupdate dengan benar
- [ ] Sender field correctly stored ('customer' atau 'organizer')

### Fitur 3: Voucher Usages

- [ ] Endpoint `POST /api/vouchers/use` berfungsi dengan kode voucher valid
- [ ] Sistem mencatat penggunaan voucher di tabel `voucherUsage`
- [ ] Counter `used_count` pada voucher bertambah setiap kali digunakan
- [ ] Error ditampilkan ketika voucher sudah mencapai max_uses
- [ ] Error ditampilkan ketika order total kurang dari min_purchase
- [ ] Error ditampilkan ketika voucher tidak aktif
- [ ] Data discount amount tersimpan dengan benar

### Fitur 4: Profile Endpoint

- [ ] Endpoint `GET /api/auth/me` mengembalikan data user yang benar
- [ ] Data yang dikembalikan: id, name, email, phone, role, isActive, createdAt
- [ ] Endpoint memerlukan token valid di header Authorization
- [ ] Error 401 ditampilkan ketika token tidak dikirim
- [ ] Error 401 ditampilkan ketika token invalid/expired
- [ ] Error 404 ditampilkan ketika user tidak ditemukan (edge case)
- [ ] Response time kurang dari 100ms

---

## Notes & Future Improvements

1. **Upload Gambar Events & Merchandise Sizes:**
    - Implementasikan actual file upload ke cloud storage (S3, GCS, dll)
    - Tambah image validation (format, size constraints)
    - Implementasikan image optimization/resize
    - Pertimbangkan CDN untuk faster image delivery
    - Implementasikan soft delete untuk image history tracking

2. **Chat Conversation Table:**
    - Implementasikan real-time chat dengan WebSocket
    - Tambah read status tracking (seen/unseen messages)
    - Add notification system ketika ada reply/message
    - Implementasikan message search functionality
    - Pertimbangkan message encryption untuk privacy
    - Tambah message reactions/emoji support

3. **Voucher Usages Tracking:**
   - Pertimbangkan menambah rate limiting untuk mencegah abuse
   - Tambahkan ekspirasi voucher (expired_at)
   - Implementasikan soft delete untuk audit trail yang lebih baik

4. **Profile Endpoint:**
   - Pertimbangkan menambah caching untuk reduce database queries
   - Implementasikan endpoint update profile (`PUT /api/auth/me`)
   - Tambah endpoint untuk change password (`POST /api/auth/change-password`)

---

## Status & Sign-Off

| Aspek | Status |
|-------|--------|
| Code Quality | ✅ Passed |
| Testing | ✅ Done |
| Documentation | ✅ Completed |
| Review | ✅ Approved |
| Deployment Ready | ✅ Yes |

**Sprint 7 Backend - COMPLETED ✅**
