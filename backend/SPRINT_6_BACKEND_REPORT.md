# Sprint 6 Backend Report

**Periode:** 23-30 April 2026  
**Project:** Monora - Aplikasi Event & Konser Online dengan Sistem Pembelian Tiket + Merchandise  
**Fokus laporan:** Backend saja

## Ringkasan Per PIC

| PIC | Fitur Backend | File Kode Utama |
| --- | --- | --- |
| RAF Yuda Pratama | Pengelolaan event terkait tickets, merchandise, dan error handling backend | [src/routes/events.js](src/routes/events.js#L1), [src/controllers/EventController.js](src/controllers/EventController.js#L8), [src/services/EventService.js](src/services/EventService.js#L97), [src/models/EventModel.js](src/models/EventModel.js#L82), [src/utils/ApiError.js](src/utils/ApiError.js#L1), [src/utils/asyncHandler.js](src/utils/asyncHandler.js#L1) |
| Muhammad Zakri Alfiansyah (ALF) | CRUD categories | [src/routes/categories.js](src/routes/categories.js#L1), [src/controllers/CategoryController.js](src/controllers/CategoryController.js#L8), [src/services/CategoryService.js](src/services/CategoryService.js#L17) |
| Afdri Ahira Mulya (AFR) | Implementasi tags di backend melalui sinkronisasi tag saat create/update event | [src/services/EventService.js](src/services/EventService.js#L97), [src/models/EventModel.js](src/models/EventModel.js#L68) |
| Aan Adriyana (AAN) | CRUD vouchers, validasi voucher, penggunaan voucher, dan error handling backend | [src/routes/vouchers.js](src/routes/vouchers.js#L1), [src/controllers/VoucherController.js](src/controllers/VoucherController.js#L8), [src/services/VoucherService.js](src/services/VoucherService.js#L27), [src/utils/ApiError.js](src/utils/ApiError.js#L1) |

## Detail Pekerjaan Backend

### 1. RAF Yuda Pratama
Fokus backend yang dikerjakan adalah fitur event yang berhubungan dengan ticket dan merchandise. Logika utamanya ada pada proses create/update event, sinkronisasi ticket types, dan sinkronisasi merchandise beserta size dan color. Selain itu, bagian error handling juga dipakai untuk memastikan respons error lebih rapi dan konsisten.

**Kode yang dikerjakan:**
- [src/routes/events.js](src/routes/events.js#L9) untuk endpoint event.
- [src/controllers/EventController.js](src/controllers/EventController.js#L8) untuk handler list, create, update, delete, dan discount.
- [src/services/EventService.js](src/services/EventService.js#L97) untuk sinkronisasi tags, tickets, merchandise, create, update, dan delete event.
- [src/models/EventModel.js](src/models/EventModel.js#L82) untuk operasi database ticket, merchandise, size, color, dan discount.
- [src/utils/ApiError.js](src/utils/ApiError.js#L1) untuk penanganan error terstruktur.
- [src/utils/asyncHandler.js](src/utils/asyncHandler.js#L1) untuk membungkus async route agar error lebih mudah ditangani.

**Catatan kode:**
- `syncTickets` berada di [src/services/EventService.js](src/services/EventService.js#L106).
- `syncMerchandise` berada di [src/services/EventService.js](src/services/EventService.js#L121).
- `createEvent` dan `updateEvent` berada di [src/services/EventService.js](src/services/EventService.js#L166) dan [src/services/EventService.js](src/services/EventService.js#L187).

### 2. Muhammad Zakri Alfiansyah (ALF)
Fokus backend yang dikerjakan adalah CRUD categories. Fitur ini menangani daftar kategori, pembuatan kategori baru, perubahan data kategori, dan penghapusan kategori.

**Kode yang dikerjakan:**
- [src/routes/categories.js](src/routes/categories.js#L9) untuk endpoint category.
- [src/controllers/CategoryController.js](src/controllers/CategoryController.js#L8) untuk list, create, update, dan remove.
- [src/services/CategoryService.js](src/services/CategoryService.js#L17) untuk logic bisnis category.

**Catatan kode:**
- `createCategory` berada di [src/services/CategoryService.js](src/services/CategoryService.js#L22).
- `updateCategory` berada di [src/services/CategoryService.js](src/services/CategoryService.js#L33).
- `deleteCategory` berada di [src/services/CategoryService.js](src/services/CategoryService.js#L39).

### 3. Afdri Ahira Mulya (AFR)
Fokus backend yang dikerjakan adalah tags. Di backend proyek ini, tags tidak memakai CRUD route terpisah, tetapi diolah saat event dibuat atau diperbarui. Data tag akan di-upsert ke tabel tag lalu dihubungkan ke event yang sesuai.

**Kode yang dikerjakan:**
- [src/services/EventService.js](src/services/EventService.js#L97) untuk sinkronisasi tags saat create/update event.
- [src/models/EventModel.js](src/models/EventModel.js#L68) untuk `upsertTag`, `addEventTag`, dan `clearEventTags`.

**Catatan laporan:**
- Jika ingin ditulis sebagai CRUD tags, sebaiknya dijelaskan sebagai implementasi pengelolaan tags pada backend event, bukan CRUD route tags yang berdiri sendiri.

### 4. Aan Adriyana (AAN)
Fokus backend yang dikerjakan adalah voucher. Fitur ini mencakup CRUD voucher, validasi voucher sebelum dipakai saat checkout, dan penggunaan voucher pada order.

**Kode yang dikerjakan:**
- [src/routes/vouchers.js](src/routes/vouchers.js#L9) untuk endpoint voucher.
- [src/controllers/VoucherController.js](src/controllers/VoucherController.js#L8) untuk list, create, update, delete, validate, dan use voucher.
- [src/services/VoucherService.js](src/services/VoucherService.js#L27) untuk logic voucher.
- [src/utils/ApiError.js](src/utils/ApiError.js#L1) untuk validasi dan error handling.

**Catatan kode:**
- `createVoucher` berada di [src/services/VoucherService.js](src/services/VoucherService.js#L34).
- `updateVoucher` berada di [src/services/VoucherService.js](src/services/VoucherService.js#L64).
- `deleteVoucher` berada di [src/services/VoucherService.js](src/services/VoucherService.js#L94).
- `validateVoucher` berada di [src/services/VoucherService.js](src/services/VoucherService.js#L104).
- `useVoucher` berada di [src/services/VoucherService.js](src/services/VoucherService.js#L148).

## Ringkasan Singkat untuk Laporan

Pada Sprint 6, pekerjaan backend difokuskan pada pengembangan fitur event, category, tags, dan voucher. RAF menangani logika event yang mencakup tickets, merchandise, serta error handling. ALF mengerjakan CRUD categories. AFR menangani pengelolaan tags pada backend event. AAN mengerjakan CRUD voucher, validasi voucher, serta proses penggunaan voucher.
