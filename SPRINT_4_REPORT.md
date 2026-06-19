# SPRINT 4 REPORT - Backend
**Periode:** 4-11 April 2026  
**Product:** Monora - Aplikasi Event & Konser Online dengan Sistem Pembelian Tiket + Merchandise

---

## Ringkasan Sprint 4

| Aspek | Detail |
|-------|--------|
| **Total Mandays (Estimation)** | 5 |
| **Total Mandays (Realization)** | 5 |
| **Total Story Points** | 6.5 |
| **Status** | Done |

---

## Tim Pengembang Backend

| No | Nama | NPM | Role | Fitur yang Dikerjakan |
|----|------|-----|------|----------------------|
| 1 | Raffa Yuda Pratama | 0110224081 | Developer | Konfigurasi database, testing koneksi, endpoint health |
| 2 | Muhammad Zakri Alfiansyah | 0110224153 | Developer | Routes API dan insert data (seed) |
| 3 | Afrid Ahira Mulya | 0110224238 | Developer | Models dan tabel ticket |
| 4 | Aan Adriyana | 0110224014 | Developer | Controllers CRUD dan setup database awal |

---

## Detail Fitur yang Dikerjakan

### 1) Raffa Yuda Pratama (RAF)
**Issue:** Konfigurasi Database, Testing Koneksi, membuat endpoint health

**Implementasi utama:**
- Konfigurasi database Prisma dan koneksi MySQL di [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
- Endpoint health check di [backend/src/index.js](backend/src/index.js).

**Catatan:**
- Health check endpoint: `GET /api/health`.
- Prisma setup memakai `DATABASE_URL`.

### 2) Muhammad Zakri Alfiansyah (ALF)
**Issue:** Membuat Routes API dan Insert Data

**Implementasi utama:**
- Routes API untuk resource utama di:
  - [backend/src/routes/auth.js](backend/src/routes/auth.js)
  - [backend/src/routes/users.js](backend/src/routes/users.js)
  - [backend/src/routes/categories.js](backend/src/routes/categories.js)
  - [backend/src/routes/events.js](backend/src/routes/events.js)
  - [backend/src/routes/orders.js](backend/src/routes/orders.js)
- Seed data untuk insert data awal di [backend/prisma/seed.js](backend/prisma/seed.js).

### 3) Afrid Ahira Mulya (AFR)
**Issue:** Membuat Models dan membuat tabel ticket

**Implementasi utama:**
- Tabel `ticket_types` dibuat pada Prisma schema di [backend/prisma/schema.prisma](backend/prisma/schema.prisma).
- Relasi ticket types terhadap event dan order items sudah didefinisikan di schema.

### 4) Aan Adriyana (AAN)
**Issue:** Membuat Controllers CRUD, dan Membuat Database

**Implementasi utama:**
- Controllers CRUD untuk resource utama di:
  - [backend/src/controllers/AuthController.js](backend/src/controllers/AuthController.js)
  - [backend/src/controllers/UserController.js](backend/src/controllers/UserController.js)
  - [backend/src/controllers/CategoryController.js](backend/src/controllers/CategoryController.js)
  - [backend/src/controllers/EventController.js](backend/src/controllers/EventController.js)
  - [backend/src/controllers/OrderController.js](backend/src/controllers/OrderController.js)
- Database schema awal dibangun di [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

---

## Ringkasan Perubahan Kode

**File utama yang terlibat:**
- [backend/src/index.js](backend/src/index.js)
- [backend/prisma/schema.prisma](backend/prisma/schema.prisma)
- [backend/prisma/seed.js](backend/prisma/seed.js)
- [backend/src/routes/auth.js](backend/src/routes/auth.js)
- [backend/src/routes/users.js](backend/src/routes/users.js)
- [backend/src/routes/categories.js](backend/src/routes/categories.js)
- [backend/src/routes/events.js](backend/src/routes/events.js)
- [backend/src/routes/orders.js](backend/src/routes/orders.js)
- [backend/src/controllers/AuthController.js](backend/src/controllers/AuthController.js)
- [backend/src/controllers/UserController.js](backend/src/controllers/UserController.js)
- [backend/src/controllers/CategoryController.js](backend/src/controllers/CategoryController.js)
- [backend/src/controllers/EventController.js](backend/src/controllers/EventController.js)
- [backend/src/controllers/OrderController.js](backend/src/controllers/OrderController.js)

---

## Testing Checklist

- [ ] `GET /api/health` returns `{ status: "ok" }`.
- [ ] Prisma `DATABASE_URL` terkonfigurasi dengan benar.
- [ ] `prisma generate` dan koneksi DB berhasil.
- [ ] Routes API bisa diakses sesuai role.
- [ ] Seed data berhasil diinsert melalui `prisma/seed.js`.
- [ ] Ticket types table terbuat dan bisa direlasikan ke event.
- [ ] CRUD controllers merespons request dengan benar.

---

## Status

Sprint 4 backend selesai dengan setup database, routing dasar, controller CRUD, dan tabel ticket types sebagai fondasi awal fitur berikutnya.
