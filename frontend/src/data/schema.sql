-- =====================================================
-- MonokoFest / Monora - Database Schema
-- MySQL 8.0+
-- =====================================================

CREATE DATABASE IF NOT EXISTS monora_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE monora_db;

-- ─────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────
CREATE TABLE users (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(255)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  phone         VARCHAR(20)     NULL,
  role          ENUM('customer', 'event_admin', 'app_admin') NOT NULL DEFAULT 'customer',
  is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────
CREATE TABLE categories (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL UNIQUE,
  icon       VARCHAR(50)   NULL COMMENT 'Icon identifier, e.g. IoMusicalNotes',
  gradient   VARCHAR(120)  NULL COMMENT 'CSS gradient string',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default categories
INSERT INTO categories (name, icon, gradient) VALUES
  ('Concerts',  'IoMusicalNotes', 'linear-gradient(135deg, #6366f1, #4f46e5)'),
  ('Sports',    'IoFootball',     'linear-gradient(135deg, #06b6d4, #0891b2)'),
  ('Comedy',    'IoHappy',        'linear-gradient(135deg, #f97316, #ea580c)'),
  ('Festivals', 'IoSparkles',     'linear-gradient(135deg, #ec4899, #db2777)');


-- ─────────────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────────────
CREATE TABLE events (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)  NOT NULL,
  slug         VARCHAR(255)  NOT NULL UNIQUE,
  display_date VARCHAR(100)  NULL COMMENT 'Formatted date string, e.g. Sat, Oct 26 | 8 PM',
  full_date    DATE          NULL,
  time_range   VARCHAR(50)   NULL COMMENT 'e.g. 8:00 PM - 2:00 AM',
  venue        VARCHAR(255)  NOT NULL,
  city         VARCHAR(100)  NOT NULL,
  province     VARCHAR(100)  NULL,
  address      VARCHAR(500)  NULL,
  latitude     DECIMAL(10,7) NULL,
  longitude    DECIMAL(10,7) NULL,
  category_id  BIGINT UNSIGNED NULL,
  image_url    VARCHAR(500)  NULL,
  thumbnail_url VARCHAR(500) NULL,
  description  TEXT          NULL,
  artist       VARCHAR(255)  NULL,
  organizer    VARCHAR(255)  NULL,
  status       ENUM('draft', 'published', 'cancelled') NOT NULL DEFAULT 'draft',
  has_merch    BOOLEAN       NOT NULL DEFAULT FALSE,
  created_by   BIGINT UNSIGNED NOT NULL COMMENT 'user.id of event_admin or app_admin',
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_events_slug       (slug),
  INDEX idx_events_category   (category_id),
  INDEX idx_events_status     (status),
  INDEX idx_events_full_date  (full_date),
  INDEX idx_events_city       (city),
  INDEX idx_events_created_by (created_by),

  CONSTRAINT fk_events_category  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- EVENT TAGS  (many-to-many)
-- ─────────────────────────────────────────────────────
CREATE TABLE tags (
  id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE event_tags (
  event_id BIGINT UNSIGNED NOT NULL,
  tag_id   BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (event_id, tag_id),

  CONSTRAINT fk_et_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  CONSTRAINT fk_et_tag   FOREIGN KEY (tag_id)   REFERENCES tags(id)   ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- TICKET TYPES  (per event)
-- ─────────────────────────────────────────────────────
CREATE TABLE ticket_types (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id    BIGINT UNSIGNED NOT NULL,
  type_name   VARCHAR(100)    NOT NULL COMMENT 'e.g. General Admission, VIP',
  price       DECIMAL(12,2)   NOT NULL DEFAULT 0,
  description VARCHAR(500)    NULL,
  available   INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_tt_event (event_id),
  CONSTRAINT fk_tt_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- MERCHANDISE  (per event)
-- ─────────────────────────────────────────────────────
CREATE TABLE merchandise (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id   BIGINT UNSIGNED NOT NULL,
  name       VARCHAR(200)    NOT NULL,
  price      DECIMAL(12,2)   NOT NULL DEFAULT 0,
  image_url  VARCHAR(500)    NULL,
  stock      INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_merch_event (event_id),
  CONSTRAINT fk_merch_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sizes & colours stored as separate rows for normalisation
CREATE TABLE merchandise_sizes (
  id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  merch_id  BIGINT UNSIGNED NOT NULL,
  size_name VARCHAR(10)     NOT NULL COMMENT 'S, M, L, XL, etc.',

  CONSTRAINT fk_ms_merch FOREIGN KEY (merch_id) REFERENCES merchandise(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE merchandise_colors (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  merch_id   BIGINT UNSIGNED NOT NULL,
  color_name VARCHAR(30)     NOT NULL,

  CONSTRAINT fk_mc_merch FOREIGN KEY (merch_id) REFERENCES merchandise(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────
CREATE TABLE orders (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code       VARCHAR(30)   NOT NULL UNIQUE COMMENT 'Readable code, e.g. ORD-1717123456789',
  user_id          BIGINT UNSIGNED NOT NULL,
  status           ENUM('pending', 'confirmed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
  subtotal         DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT 'Pre-discount subtotal',
  voucher_code     VARCHAR(50)   NULL COMMENT 'Applied voucher code',
  voucher_discount DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT 'Voucher discount amount',
  service_fee      DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT 'Service fee (e.g. 5%)',
  total            DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT 'Grand total (subtotal - voucher_discount + service_fee)',
  delivery_method  ENUM('pickup', 'delivery') NULL COMMENT 'For merch orders',
  delivery_address VARCHAR(500)  NULL COMMENT 'Shipping address for delivery',
  delivery_city    VARCHAR(100)  NULL,
  delivery_zip     VARCHAR(20)   NULL,
  customer_name    VARCHAR(100)  NULL COMMENT 'Snapshot of customer name at order time',
  customer_email   VARCHAR(255)  NULL COMMENT 'Snapshot of customer email at order time',
  customer_phone   VARCHAR(20)   NULL COMMENT 'Snapshot of customer phone at order time',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_orders_user   (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_code   (order_code),

  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- ORDER ITEMS  (ticket or merch line items)
-- ─────────────────────────────────────────────────────
CREATE TABLE order_items (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id       BIGINT UNSIGNED NOT NULL,
  item_type      ENUM('ticket', 'merch') NOT NULL,
  event_id       BIGINT UNSIGNED NULL,
  ticket_type_id BIGINT UNSIGNED NULL COMMENT 'Set when item_type = ticket',
  merch_id       BIGINT UNSIGNED NULL COMMENT 'Set when item_type = merch',
  title          VARCHAR(255)    NOT NULL COMMENT 'Snapshot of item name at order time',
  quantity       INT UNSIGNED    NOT NULL DEFAULT 1,
  unit_price     DECIMAL(12,2)   NOT NULL DEFAULT 0,
  original_price DECIMAL(12,2)   NULL COMMENT 'Pre-discount price when event discount applied',
  size           VARCHAR(10)     NULL COMMENT 'For merch only',
  color          VARCHAR(30)     NULL COMMENT 'For merch only',
  event_date     VARCHAR(100)    NULL COMMENT 'Snapshot of event display date',
  event_image    VARCHAR(500)    NULL COMMENT 'Snapshot of event thumbnail URL',

  INDEX idx_oi_order    (order_id),
  INDEX idx_oi_event    (event_id),

  CONSTRAINT fk_oi_order  FOREIGN KEY (order_id)       REFERENCES orders(id)       ON DELETE CASCADE,
  CONSTRAINT fk_oi_event  FOREIGN KEY (event_id)       REFERENCES events(id)       ON DELETE SET NULL,
  CONSTRAINT fk_oi_ticket FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(id) ON DELETE SET NULL,
  CONSTRAINT fk_oi_merch  FOREIGN KEY (merch_id)       REFERENCES merchandise(id)  ON DELETE SET NULL
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- HELPFUL VIEWS
-- ─────────────────────────────────────────────────────

-- View: Event with category name
CREATE OR REPLACE VIEW v_events AS
SELECT
  e.*,
  c.name AS category_name,
  u.name AS creator_name
FROM events e
LEFT JOIN categories c ON c.id = e.category_id
LEFT JOIN users u      ON u.id = e.created_by;

-- View: Order summary with customer info
CREATE OR REPLACE VIEW v_orders AS
SELECT
  o.*,
  u.name  AS customer_name,
  u.email AS customer_email,
  (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
FROM orders o
LEFT JOIN users u ON u.id = o.user_id;

-- View: Revenue per event
CREATE OR REPLACE VIEW v_event_revenue AS
SELECT
  e.id          AS event_id,
  e.title,
  e.created_by,
  COUNT(DISTINCT o.id) AS order_count,
  COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS total_revenue
FROM events e
LEFT JOIN order_items oi ON oi.event_id = e.id
LEFT JOIN orders o       ON o.id = oi.order_id AND o.status = 'confirmed'
GROUP BY e.id, e.title, e.created_by;


-- ─────────────────────────────────────────────────────
-- VOUCHERS
-- ─────────────────────────────────────────────────────
CREATE TABLE vouchers (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(50)     NOT NULL UNIQUE,
  type          ENUM('percentage', 'flat') NOT NULL DEFAULT 'percentage',
  value         DECIMAL(12,2)   NOT NULL DEFAULT 0 COMMENT 'Percentage (0-100) or flat amount',
  min_purchase  DECIMAL(12,2)   NOT NULL DEFAULT 0,
  max_uses      INT UNSIGNED    NOT NULL DEFAULT 0,
  used_count    INT UNSIGNED    NOT NULL DEFAULT 0,
  description   VARCHAR(255)    NULL,
  is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
  expires_at    TIMESTAMP       NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_voucher_code (code)
) ENGINE=InnoDB;

INSERT INTO vouchers (code, type, value, min_purchase, max_uses, description) VALUES
  ('WELCOME20', 'percentage', 20, 50,  100, '20% off your first order'),
  ('MONORA10',  'percentage', 10, 0,   500, '10% off any order'),
  ('SAVE15',    'percentage', 15, 100, 200, '15% off orders above Rp100'),
  ('FLAT25',    'flat',       25, 75,  150, 'Rp25 off orders above Rp75'),
  ('FEST30',    'percentage', 30, 150, 50,  '30% off orders above Rp150');


-- ─────────────────────────────────────────────────────
-- VOUCHER USAGES  (tracks which user used which voucher on which order)
-- ─────────────────────────────────────────────────────
CREATE TABLE voucher_usages (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  voucher_id      BIGINT UNSIGNED NOT NULL,
  order_id        BIGINT UNSIGNED NOT NULL,
  user_id         BIGINT UNSIGNED NOT NULL,
  discount_amount DECIMAL(14,2)   NOT NULL DEFAULT 0,
  used_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_vu_voucher (voucher_id),
  INDEX idx_vu_order   (order_id),
  INDEX idx_vu_user    (user_id),

  CONSTRAINT fk_vu_voucher FOREIGN KEY (voucher_id) REFERENCES vouchers(id)  ON DELETE CASCADE,
  CONSTRAINT fk_vu_order   FOREIGN KEY (order_id)   REFERENCES orders(id)    ON DELETE CASCADE,
  CONSTRAINT fk_vu_user    FOREIGN KEY (user_id)    REFERENCES users(id)     ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- EVENT DISCOUNTS
-- ─────────────────────────────────────────────────────
CREATE TABLE event_discounts (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id    BIGINT UNSIGNED NOT NULL,
  percentage  DECIMAL(5,2)    NOT NULL COMMENT 'e.g. 15.00 for 15%',
  label       VARCHAR(100)    NULL COMMENT 'e.g. Early Bird Sale',
  starts_at   TIMESTAMP       NULL,
  expires_at  TIMESTAMP       NULL,
  is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ed_event (event_id),
  CONSTRAINT fk_ed_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- REFUNDS
-- ─────────────────────────────────────────────────────
CREATE TABLE refunds (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  refund_code  VARCHAR(30)    NOT NULL UNIQUE COMMENT 'e.g. REF-1717123456789',
  order_id     BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED NOT NULL,
  reason       TEXT            NULL,
  status       ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP      NULL,

  INDEX idx_refund_order  (order_id),
  INDEX idx_refund_user   (user_id),
  INDEX idx_refund_status (status),

  CONSTRAINT fk_refund_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_refund_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
) ENGINE=InnoDB;


-- ─────────────────────────────────────────────────────
-- CHAT MESSAGES  (customer ↔ organizer per event)
-- ─────────────────────────────────────────────────────
CREATE TABLE chat_conversations (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED NOT NULL,
  event_id       BIGINT UNSIGNED NOT NULL,
  user_name      VARCHAR(100)    NULL COMMENT 'Denormalized customer display name',
  event_title    VARCHAR(255)    NULL,
  organizer_name VARCHAR(255)    NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_chat_user_event (user_id, event_id),
  INDEX idx_chat_user  (user_id),
  INDEX idx_chat_event (event_id),

  CONSTRAINT fk_chat_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  CONSTRAINT fk_chat_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE chat_messages (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender          ENUM('customer', 'organizer') NOT NULL,
  message_text    TEXT            NOT NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_cm_conv (conversation_id),

  CONSTRAINT fk_cm_conv FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB;
