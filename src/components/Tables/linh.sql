CREATE DATABASE IF NOT EXISTS warehouse_management;
USE warehouse_management;
-- SET SQL_MODE = '';

-- Bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  type ENUM('PRODUCT', 'MATERIAL') NOT NULL DEFAULT 'PRODUCT',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for categories table
INSERT INTO categories (code, name, description, type, status) VALUES
('CAT-PRD-001','Nuts', 'Raw and processed nuts', 'MATERIAL', 'ACTIVE'),
('CAT-PRD-002','Dried Fruits', 'Various dried fruits', 'MATERIAL', 'ACTIVE'),
('CAT-PRD-003','Nut Products', 'Processed nut products', 'PRODUCT', 'ACTIVE'),
('CAT-PRD-004','Tet Gift Sets', 'Special gift sets for Tet holiday', 'PRODUCT', 'ACTIVE'),
('CAT-PRD-005','PACKING', 'PACKING materials', 'PRODUCT', 'ACTIVE');

-- Bảng group_customers
CREATE TABLE IF NOT EXISTS group_customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for group_customers table
INSERT INTO group_customers (name, status) VALUES
('Supermarkets', 'ACTIVE'),
('Online Retailers', 'ACTIVE'),
('Corporate Clients', 'ACTIVE'),
('Specialty Nut Shops', 'ACTIVE'),
('Wholesale Distributors', 'ACTIVE');

-- Bảng customers
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  group_customer_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone CHAR(10) DEFAULT NULL,
  gender BOOLEAN DEFAULT NULL,
  birthday DATE DEFAULT NULL,
  email VARCHAR(255) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  city VARCHAR(255) DEFAULT NULL,
  district VARCHAR(255) DEFAULT NULL,
  ward VARCHAR(255) DEFAULT NULL,
  note TEXT DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (group_customer_id) REFERENCES group_customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for customers table
INSERT INTO customers (code, group_customer_id, name, phone, gender, email, status) VALUES
('CUS-001', 1, 'MegaMart Chain', '8490123456', 1, 'purchasing@megamart.com', 'ACTIVE'),
('CUS-002', 2, 'NutLover Online Store', '8491234567', 0, 'orders@nutlover.com', 'ACTIVE'),
('CUS-003', 3, 'TechGiant Corp', '8492345679', 1, 'giftdept@techgiant.com', 'ACTIVE'),
('CUS-004', 4, 'Nut Haven Boutique', '8493456789', 0, 'shop@nuthaven.com', 'ACTIVE'),
('CUS-005', 5, 'Global Nut Distributors', '8494567890', 1, 'bulk@globalnut.com', 'ACTIVE');

-- Bảng providers
CREATE TABLE IF NOT EXISTS providers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  city VARCHAR(255) DEFAULT NULL,
  district VARCHAR(255) DEFAULT NULL,
  ward VARCHAR(255) DEFAULT NULL,
  representative_name VARCHAR(255) DEFAULT NULL,
  representative_phone CHAR(10) DEFAULT NULL,
  representative_email VARCHAR(255) DEFAULT NULL,
  phone CHAR(10) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  note TEXT DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data for providers table
INSERT INTO providers (code , name,  website,  address,  city,  district,  ward,  representative_name,  representative_phone,  representative_email,  phone,  email,  note,  status) VALUES
('SUP-001', 'Vietnam Nut Co.',  'www.vietnamnut.com',  '123 Le Loi Street',  'Ho Chi Minh City',  'District 1',  'Ben Nghe Ward',  'John Doe',  '0987654321',  'john.doe@vietnamnut.com',  '8412345678',  'info@vietnamnut.com',  'Leading supplier of cashews and other nuts in Vietnam. Specializing in premium grade exports.',  'ACTIVE'),
('SUP-002', 'US Almond Exports',  'www.usalmonds.com',  '456 California Avenue',  'Sacramento',  'Downtown',  'Central District',  'Alice Smith',  '0987654322',  'alice.smith@usalmonds.com',  '1800123456',  'sales@usalmonds.com',  'California-based almond producer with over 20 years of export experience to Asia.',  'ACTIVE'),
('SUP-003', 'Iran Pistachio Traders',  'www.iranpistachio.com',  '789 Tehran Road',  'Kerman',  'Central',  'Rafsanjan',  'Mohammad Ali',  '0987654323',  'mohammad.ali@iranpistachio.com',  '9898765432',  'contact@iranpistachio.com',  'Family-owned pistachio farm and processing facility since 1975.',  'ACTIVE'),
('SUP-004', 'Aussie Macadamia Suppliers',  'www.aussiemac.com',  '101 Brisbane Street',  'Gold Coast',  'Northern',  'Bundall',  'Steve Johnson',  '0987654324',  'steve.j@aussiemac.com',  '6123456789',  'orders@aussiemac.com',  'Australias premier macadamia nut supplier with sustainable farming practices.',  'INACTIVE'),
('SUP-005', 'China Peanut Farms',  'www.chinapeanut.cn',  '234 Shandong Road',  'Qingdao',  'Huangdao',  'Jiaozhou Bay',  'Li Wei',  '0987654325',  'li.wei@chinapeanut.cn',  '8612345678',  'export@chinapeanut.cn',  'Large-scale peanut farming and processing operation serving Asian markets.',  'ACTIVE'),
('SUP-006', 'Turkish Hazelnut Co.',  'www.turkishhazelnut.com',  '567 Black Sea Avenue',  'Ordu',  'Coastal',  'Fatsa',  'Mehmet Yilmaz',  '0987654326',  'mehmet@turkishhazelnut.com',  '9012345678',  'info@turkishhazelnut.com',  'Black Sea region largest hazelnut processor and exporter',  'ACTIVE'),
('SUP-007', 'Brazilian Coffee Beans Ltd',  'www.brazilcoffee.com',  '890 Santos Boulevard',  'São Paulo',  'Highland',  'Serra District',  'Paulo Santos',  '0987654327',  'paulo@brazilcoffee.com',  '5512345678',  'export@brazilcoffee.com',  'Premium coffee bean supplier from Brazils finest growing regions.',  'INACTIVE'),
('SUP-008', 'Indian Spice Traders',  'www.indianspice.in','321 Kerala Road',  'Kochi',  'Ernakulam',  'Fort Kochi',  'Raj Patel',  '0987654328',  'raj@indianspice.in',  '9112345678',  'contact@indianspice.in',  'Traditional spice trading company specializing in cardamom and pepper.',  'ACTIVE');

-- Bảng discounts
CREATE TABLE IF NOT EXISTS discounts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  coupon_code VARCHAR(100) UNIQUE NOT NULL,
  discount_value INT NOT NULL,
  discount_unit CHAR(5) NOT NULL,
  minimum_order_value INT NOT NULL,
  maximum_discount_value INT NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  valid_start TIMESTAMP NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  note TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for discounts table
INSERT INTO discounts (coupon_code, discount_value, discount_unit, minimum_order_value, maximum_discount_value, valid_until, valid_start, status) VALUES
('TET2024', 15, '%', 1000000, 500000, '2024-02-10 23:59:59', '2024-01-15 00:00:00', 'ACTIVE'),
('EARLYBIRD', 10, '%', 500000, 200000, '2024-01-31 23:59:59', '2024-01-01 00:00:00', 'ACTIVE'),
('BULKNUT', 50000, 'VND', 2000000, 50000, '2024-12-31 23:59:59', '2024-01-01 00:00:00', 'ACTIVE'),
('GIFTSET5', 5, '%', 1500000, 300000, '2024-02-29 23:59:59', '2024-02-01 00:00:00', 'ACTIVE'),
('LOYALCUST', 100000, 'VND', 3000000, 100000, '2024-12-31 23:59:59', '2024-01-01 00:00:00', 'ACTIVE');

-- Bảng category_discounts
CREATE TABLE IF NOT EXISTS category_discounts (
  discount_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (discount_id, category_id),
  FOREIGN KEY (discount_id) REFERENCES discounts(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for category_discounts table
INSERT INTO category_discounts (discount_id, category_id) VALUES
(1, 3), -- TET2024 discount applies to Nut Products
(1, 4), -- TET2024 discount also applies to Tet Gift Sets
(2, 3), -- EARLYBIRD discount applies to Nut Products
(3, 3), -- BULKNUT discount applies to Nut Products
(4, 4), -- GIFTSET5 discount applies to Tet Gift Sets
(5, 3); -- LOYALCUST discount applies to Nut Products

-- Bảng materials
CREATE TABLE IF NOT EXISTS materials (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(255) UNIQUE DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(255) NOT NULL,
  weight VARCHAR(255) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  packing VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  quantity_available INT NOT NULL DEFAULT 0,
  minimum_stock_level INT NOT NULL,
  maximum_stock_level INT NOT NULL DEFAULT 100,
  status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  note TEXT DEFAULT NULL,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for materials table
INSERT INTO materials (sku, name, unit, weight, origin, packing, quantity_available, minimum_stock_level, maximum_stock_level, status) VALUES
('MATER-001','Cashews', 'kg', 1000, 'Vietnam', 'Jar', 5000, 1000, 10000, 'ACTIVE'),
('MATER-002','Almonds', 'kg', 1000, 'USA', 'Bag', 3000, 800, 6000, 'ACTIVE'),
('MATER-003','Pistachios', 'kg', 1000, 'Iran', 'Bag', 2000, 500, 4000, 'ACTIVE'),
('MATER-004','Macadamia', 'kg', 1000, 'Australia', 'Bag', 1500, 300, 3000, 'ACTIVE'),
('MATER-005','Peanuts', 'kg', 1000, 'China', 'Jar', 4000, 1000, 8000, 'ACTIVE');

-- Bảng material_categories
CREATE TABLE IF NOT EXISTS material_categories (
  material_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (material_id, category_id),
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_categories table
INSERT INTO material_categories (material_id, category_id) VALUES
(1, 1), -- Cashews in Nuts category
(2, 1), -- Almonds in Nuts category
(3, 1), -- Pistachios in Nuts category
(4, 1), -- Macadamia in Nuts category
(5, 1); -- Peanuts in Nuts category

-- Bảng storage_areas
CREATE TABLE IF NOT EXISTS storage_areas (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for storage_areas table
INSERT INTO storage_areas (name, code, description, status) VALUES
('Main Nut Warehouse', 'MWH-01', 'Primary storage for raw nuts', 'ACTIVE'),
('Processing Area', 'PA-01', 'Nut roasting and PACKING zone', 'ACTIVE'),
('Gift Set Assembly', 'GSA-01', 'Area for assembling Tet gift sets', 'ACTIVE'),
('Cold Storage', 'CS-01', 'Temperature-controlled area for sensitive nuts', 'ACTIVE'),
('Finished Product Storage', 'FPS-01', 'Storage for packaged products and gift sets', 'ACTIVE');

-- Bảng products
CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(255) UNIQUE DEFAULT NULL,
  unit VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  packing VARCHAR(255) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  weight INT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  quantity_available INT NOT NULL DEFAULT 0,
  minimum_stock_level INT NOT NULL,
  maximum_stock_level INT NOT NULL DEFAULT 100,
  description TEXT DEFAULT NULL,
  usage_time VARCHAR(50) DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for products table
INSERT INTO products (sku, name, unit, packing, origin, weight, image, quantity_available, minimum_stock_level, maximum_stock_level, usage_time, status) VALUES
('NUT001', 'Roasted Cashews', 'kg', 'Jar', 'Vietnam', 500, 'roasted_cashews.jpg', 80, 20, 100, '3 tháng', 'ACTIVE'),
('NUT002', 'Mixed Nuts' , 'kg', 'Bag', 'Vietnam', 1000, 'mixed_nuts.jpg', 40, 15, 100, '3 tháng', 'ACTIVE'),
('NUT003', 'Salted Almonds', 'kg', 'Can', 'Vietnam', 300, 'salted_almonds.jpg', 60, 25, 100, '3 tháng', 'ACTIVE'),
('NUT004', 'Honey Roasted Peanuts', 'kg', 'Vietnam', 'Pouch', 250, 'honey_peanuts.jpg', 100, 30, 100, '3 tháng', 'ACTIVE'),
('NUT005', 'Pistachio Kernels', 'kg', 'Box', 'Vietnam', 200, 'pistachio_kernels.jpg', 45, 15, 100, '3 tháng', 'ACTIVE');

-- Bảng product_storage_locations
CREATE TABLE IF NOT EXISTS product_storage_locations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  storage_area_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (storage_area_id) REFERENCES storage_areas(id),
  UNIQUE KEY unique_product_storage (product_id, storage_area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_storage_locations table
INSERT INTO product_storage_locations (product_id, storage_area_id, quantity) VALUES
(1, 5, 500), -- 500 units of Roasted Cashews in Finished Product Storage
(2, 5, 300), -- 300 units of Mixed Nuts in Finished Product Storage
(3, 5, 400), -- 400 units of Salted Almonds in Finished Product Storage
(4, 5, 600), -- 600 units of Honey Roasted Peanuts in Finished Product Storage
(5, 5, 200); -- 200 units of Pistachio Kernels in Finished Product Storage

-- Bảng material_storage_locations
CREATE TABLE IF NOT EXISTS material_storage_locations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_id BIGINT UNSIGNED NOT NULL,
  provider_id BIGINT UNSIGNED NOT NULL,
  storage_area_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (storage_area_id) REFERENCES storage_areas(id),
  UNIQUE KEY unique_material_storage (material_id, storage_area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_storage_locations table
INSERT INTO material_storage_locations (material_id, provider_id, storage_area_id, quantity) VALUES
(1, 1 , 1, 3000), -- 3000kg of Cashews in Main Nut Warehouse
(2, 2 , 1, 2000), -- 2000kg of Almonds in Main Nut Warehouse
(3, 1 , 4, 1500), -- 1500kg of Pistachios in Cold Storage
(4, 4 , 4, 1000), -- 1000kg of Macadamia in Cold Storage
(5, 3 , 1, 2500); -- 2500kg of Peanuts in Main Nut Warehouse

-- Bảng roles
CREATE TABLE IF NOT EXISTS roles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for roles table
INSERT INTO roles (name, status) VALUES
('Admin', 'ACTIVE'),
('Manager', 'ACTIVE'),
('Sales Representative', 'ACTIVE'),
('Warehouse Operator', 'ACTIVE'),
('Quality Control Specialist', 'ACTIVE');

-- Bảng users
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id BIGINT UNSIGNED NOT NULL DEFAULT 3,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  reset_password_token TEXT DEFAULT NULL,
  token_expiry TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for users table
INSERT INTO users (role_id, email, password, status) VALUES
(1, 'admin@nutco.com', 'hashed_password_1', 'ACTIVE'),
(2, 'manager@nutco.com', 'hashed_password_2', 'ACTIVE'),
(3, 'sales@nutco.com', 'hashed_password_3', 'ACTIVE'),
(4, 'warehouse@nutco.com', 'hashed_password_4', 'ACTIVE'),
(5, 'quality@nutco.com', 'hashed_password_5', 'ACTIVE');

-- Bảng blacklist_tokens
CREATE TABLE blacklist_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    token TEXT NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng sessions
CREATE TABLE sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng material_export_receipts
CREATE TABLE IF NOT EXISTS material_export_receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  note TEXT DEFAULT NULL,
  receipt_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type ENUM('RETURN', 'NORMAL', 'OTHER', 'CANCEL') NOT NULL DEFAULT 'NORMAL',
  status ENUM('COMPLETED', 'TEMPORARY') NOT NULL DEFAULT 'TEMPORARY',
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  created_by BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_export_receipts table
INSERT INTO material_export_receipts (code, note, type, status, created_by) VALUES
('MER-001', 'For roasting process', 'NORMAL', 'TEMPORARY', 1),
('MER-002', 'For mixing process', 'NORMAL', 'TEMPORARY', 2),
('MER-003', 'For salting process', 'NORMAL', 'TEMPORARY', 1),
('MER-004', 'For gift set assembly', 'NORMAL', 'TEMPORARY', 2),
('MER-005', 'Quality check samples', 'NORMAL', 'TEMPORARY', 1);

-- Bảng material_export_receipt_details
CREATE TABLE IF NOT EXISTS material_export_receipt_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_id BIGINT UNSIGNED NOT NULL,
  material_export_receipt_id BIGINT UNSIGNED NOT NULL,
  material_storage_location_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (material_export_receipt_id) REFERENCES material_export_receipts(id),
  FOREIGN KEY (material_storage_location_id) REFERENCES material_storage_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_export_receipt_details table
INSERT INTO material_export_receipt_details (material_id, material_export_receipt_id, material_storage_location_id, quantity) VALUES
(1, 1, 1, 500), -- 500kg of Cashews for roasting
(2, 2, 2, 300), -- 300kg of Almonds for mixing
(3, 3, 3, 200), -- 200kg of Pistachios for salting
(4, 4, 4, 100), -- 100kg of Macadamia for gift set assembly
(5, 5, 5, 50);  -- 50kg of Peanuts for quality check

-- Bảng material_import_receipts
CREATE TABLE IF NOT EXISTS material_import_receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider_id BIGINT UNSIGNED NULL,  -- Cho phép NULL khi type là RETURN
  code VARCHAR(255) UNIQUE NOT NULL,
  type ENUM('RETURN', 'NORMAL') NOT NULL DEFAULT 'NORMAL',
  note TEXT DEFAULT NULL,
  receipt_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_price INT NULL DEFAULT 0,  -- Cho phép NULL khi type là RETURN
  status ENUM('APPROVED', 'PENDING_APPROVED', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING_APPROVED',
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  created_by BIGINT UNSIGNED NOT NULL,
  approved_by BIGINT UNSIGNED NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (approved_by) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_import_receipts table
INSERT INTO material_import_receipts (provider_id, code, type, note, total_price, status, created_by, approved_by, receiver_id) VALUES
(1, 'IMP001', 'NORMAL', 'Cashew import for Tet production', 25000, 'COMPLETED', 1, NULL, 3),
(2, 'IMP002', 'NORMAL', 'Almond stock replenishment', 18000, 'COMPLETED', 2, NULL, 3),
(3, 'IMP003', 'NORMAL', 'Rush pistachio order for gift sets', 15000, 'COMPLETED', 1, NULL, 3),
(4, 'IMP004', 'NORMAL', 'Macadamia for premium gift boxes', 22000, 'COMPLETED', 1, 2, 3),
(5, 'IMP005', 'NORMAL', 'Peanut import for roasting', 10000, 'COMPLETED', 1, 2, 3);
-- Bảng material_import_receipt_details
CREATE TABLE IF NOT EXISTS material_import_receipt_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  material_id BIGINT UNSIGNED NOT NULL,
  material_import_receipt_id BIGINT UNSIGNED NOT NULL,
  material_storage_location_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (material_import_receipt_id) REFERENCES material_import_receipts(id),
  FOREIGN KEY (material_storage_location_id) REFERENCES material_storage_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for material_import_receipt_details table
INSERT INTO material_import_receipt_details (material_id, material_import_receipt_id, material_storage_location_id, quantity, price) VALUES
(1, 1, 1, 5000, 5),   -- 5000 kg of Cashews at 5 USD/kg for receipt IMP001
(2, 2, 2, 3000, 6),   -- 3000 kg of Almonds at 6 USD/kg for receipt IMP002
(3, 3, 3, 2000, 7),   -- 2000 kg of Pistachios at 7.5 USD/kg for receipt IMP003
(4, 4, 4, 1500, 14),  -- 1500 kg of Macadamia at 14.67 USD/kg for receipt IMP004
(5, 5, 5, 4000, 2);   -- 4000 kg of Peanuts at 2.5 USD/kg for receipt IMP005

-- Bảng profiles
CREATE TABLE IF NOT EXISTS profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone CHAR(10) DEFAULT NULL,
  birthday DATE DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  gender BOOLEAN DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  ward VARCHAR(255) DEFAULT NULL,
  district VARCHAR(255) DEFAULT NULL,
  city VARCHAR(255) DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for profiles table
INSERT INTO profiles (user_id, code, first_name, last_name, phone, birthday, avatar, gender, address, ward, district, city, status) VALUES
(1, 'NV0001', 'Nguyen', 'Admin', '0849011111', '1990-01-15', 'avatar1.jpg', 1, '123 Nguyen Van Linh', 'Tan Thuan', 'District 7', 'Ho Chi Minh City', 'ACTIVE'),
(2, 'NV0002', 'Tran', 'Manager', '0849022222', '1988-05-20', 'avatar2.jpg', 0, '456 Le Loi', 'Ben Nghe', 'District 1', 'Ho Chi Minh City', 'ACTIVE'),
(3, 'NV0003', 'Le', 'Sales', '0849033333', '1995-08-10', 'avatar3.jpg', 1, '789 Tran Hung Dao', 'Pham Ngu Lao', 'District 1', 'Ho Chi Minh City', 'ACTIVE'),
(4, 'NV0004', 'Pham', 'Warehouse', '0849044444', '1992-03-25', 'avatar4.jpg', 0, '101 Hai Ba Trung', 'Ben Nghe', 'District 1', 'Ho Chi Minh City', 'ACTIVE'),
(5, 'NV0005', 'Vo', 'Quality', '0849055555', '1993-11-30', 'avatar5.jpg', 1, '202 Nam Ky Khoi Nghia', 'Ben Thanh', 'District 1', 'Ho Chi Minh City', 'ACTIVE');

-- Bảng orders
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT UNSIGNED NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_date DATE,
  total_price INT NOT NULL,
  phone VARCHAR(10) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  ward VARCHAR(255) NOT NULL,
  status ENUM('PROCESSED', 'DELIVERED', 'SHIPPING', 'PENDING', 'CANCELLED', 'RETURNED', 'DRAFT') NOT NULL DEFAULT 'PENDING',
  payment_status ENUM('PAID', 'PENDING') NOT NULL DEFAULT 'PENDING',
  payment_method ENUM('CASH', 'BANK_TRANSFER') DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (created_by) REFERENCES profiles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for orders table
INSERT INTO orders (customer_id, created_by, code, delivery_date, total_price, phone, address, city, district, ward, status, payment_status, payment_method) VALUES
(1, 1, 'DH00001', '2024-02-02', 15000000, '8490123456', '123 Supermarket St', 'Ho Chi Minh City', 'District 1', 'Ben Nghe', 'PENDING', 'PENDING', 'BANK_TRANSFER'),
(2, 2, 'DH00002', '2024-02-02', 5000000, '8491234567', '456 Online Ave', 'Hanoi', 'Hoan Kiem', 'Hang Bac', 'PROCESSED', 'PAID', 'CASH'),
(3, 1, 'DH00003', '2024-02-02', 25000000, '8492345678', '789 Corporate Blvd', 'Da Nang', 'Hai Chau', 'Thach Thang', 'SHIPPING', 'PAID', 'BANK_TRANSFER'),
(4, 2, 'DH00004', '2024-02-02', 3500000, '8493456789', '101 Nut Shop Lane', 'Can Tho', 'Ninh Kieu', 'Tan An', 'DRAFT', 'PENDING', 'CASH'),
(5, 1, 'DH00005', '2024-02-02', 50000000, '8494567890', '202 Wholesale Road', 'Ho Chi Minh City', 'District 7', 'Tan Phu', 'PROCESSED', 'PAID', 'BANK_TRANSFER');

-- Bảng order_details
CREATE TABLE IF NOT EXISTS order_details (
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price INT NOT NULL DEFAULT 0,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for order_details table
INSERT INTO order_details (order_id, product_id, quantity, price, status) VALUES
(1, 2, 20, 250000, 'ACTIVE'),  -- 20 Mixed Nuts for MegaMart
(1, 4, 30, 120000, 'ACTIVE'),       -- 30 Honey Roasted Peanuts for MegaMart
(2, 1, 10, 150000, 'ACTIVE'),        -- 10 Roasted Cashews for NutLover Online
(2, 3, 10, 180000, 'ACTIVE'),        -- 10 Salted Almonds for NutLover Online
(3, 5, 50, 220000, 'ACTIVE');  -- 50 Pistachio Kernels for TechGiant Corp

-- Bảng product_categories
CREATE TABLE IF NOT EXISTS product_categories (
  product_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_categories table
INSERT INTO product_categories (product_id, category_id) VALUES
(1, 3), -- Roasted Cashews in Nut Products category
(2, 3), -- Mixed Nuts in Nut Products category
(3, 3), -- Salted Almonds in Nut Products category
(4, 3), -- Honey Roasted Peanuts in Nut Products category
(5, 3); -- Pistachio Kernels in Nut Products category

-- Bảng product_discounts
CREATE TABLE IF NOT EXISTS product_discounts (
  discount_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (product_id, discount_id),
  FOREIGN KEY (discount_id) REFERENCES discounts(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_discounts table
INSERT INTO product_discounts (discount_id, product_id) VALUES
(1, 1), -- TET2024 discount applies to Roasted Cashews
(1, 2), -- TET2024 discount applies to Mixed Nuts
(2, 3), -- EARLYBIRD discount applies to Salted Almonds
(3, 4), -- BULKNUT discount applies to Honey Roasted Peanuts
(5, 5); -- LOYALCUST discount applies to Pistachio Kernels

-- Bảng product_export_receipts
CREATE TABLE IF NOT EXISTS product_export_receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  note TEXT DEFAULT NULL,
  receipt_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type ENUM('NORMAL', 'CANCEL') NOT NULL DEFAULT 'NORMAL',
  status ENUM('COMPLETED', 'TEMPORARY') NOT NULL DEFAULT 'TEMPORARY',
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  created_by BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_export_receipts table
INSERT INTO product_export_receipts (code, note, type, status, created_by) VALUES
('PER-001', 'Tet gift set shipment to MegaMart', 'NORMAL', 'COMPLETED', 1),
('PER-002', 'Online order fulfillment', 'NORMAL', 'COMPLETED', 2),
('PER-003', 'Corporate gift dispatch', 'NORMAL', 'COMPLETED', 1),
('PER-004', 'Specialty shop restocking', 'NORMAL', 'COMPLETED', 2),
('PER-005', 'Wholesale order preparation', 'NORMAL', 'COMPLETED', 1);

-- Bảng product_export_receipt_details
CREATE TABLE IF NOT EXISTS product_export_receipt_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  product_export_receipt_id BIGINT UNSIGNED NOT NULL,
  product_storage_location_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (product_export_receipt_id) REFERENCES product_export_receipts(id),
  FOREIGN KEY (product_storage_location_id) REFERENCES product_storage_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_export_receipt_details (đã sửa)
INSERT INTO product_export_receipt_details (product_id, product_export_receipt_id, product_storage_location_id, quantity) VALUES
(1, 1, 1, 100),  -- 100 Roasted Cashews from location 1
(2, 2, 2, 50),   -- 50 Mixed Nuts from location 2
(3, 3, 3, 200),  -- 200 Salted Almonds from location 3
(4, 4, 4, 75),   -- 75 Honey Roasted Peanuts from location 4
(5, 5, 5, 150);

-- Bảng product_import_receipts
CREATE TABLE IF NOT EXISTS product_import_receipts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('RETURN', 'NORMAL') NOT NULL DEFAULT 'NORMAL',
  receipt_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT DEFAULT NULL,
  status ENUM('COMPLETED', 'TEMPORARY') NOT NULL DEFAULT 'TEMPORARY',
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  created_by BIGINT UNSIGNED NOT NULL,
  receiver_id BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_import_receipts table
INSERT INTO product_import_receipts (code, type, note, status, created_by, receiver_id) VALUES
('PIR-001', 'NORMAL', 'Newly processed nut products', 'COMPLETED', 1, 3),
('PIR-002', 'RETURN', 'Customer return - PACKING issue', 'COMPLETED', 2, 3),
('PIR-003', 'NORMAL', 'Gift set assembly completion', 'COMPLETED', 1, 3),
('PIR-004', 'NORMAL', 'Inter-warehouse transfer', 'COMPLETED', 2, 3),
('PIR-005', 'NORMAL', 'Special roast batch completion', 'COMPLETED', 1, 3);

-- Bảng product_import_receipt_details
CREATE TABLE IF NOT EXISTS product_import_receipt_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  product_import_receipt_id BIGINT UNSIGNED NOT NULL,
  product_storage_location_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (product_import_receipt_id) REFERENCES product_import_receipts(id),
  FOREIGN KEY (product_storage_location_id) REFERENCES product_storage_locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for product_import_receipt_details (đã sửa)
INSERT INTO product_import_receipt_details (product_id, product_import_receipt_id, product_storage_location_id, quantity) VALUES
(1, 1, 1, 500),  -- 500 Roasted Cashews to location 1
(2, 2, 2, 10),   -- 10 Mixed Nuts to location 2
(3, 3, 3, 300),  -- 300 Salted Almonds to location 3
(4, 4, 4, 200),  -- 200 Honey Roasted Peanuts to location 4
(5, 5, 5, 250);  -- 250 Pistachio Kernels to location 5

-- Bảng product_prices
CREATE TABLE IF NOT EXISTS product_prices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  price INT NOT NULL DEFAULT 0,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data
INSERT INTO product_prices (product_id, date_start, date_end, price, status) VALUES
(1, '2024-01-01', '2024-12-31', 150000, 'ACTIVE'),  -- Roasted Cashews
(2, '2024-01-01', '2024-12-31', 250000, 'ACTIVE'),  -- Mixed Nuts  
(3, '2024-01-01', '2024-12-31', 180000, 'ACTIVE'),  -- Salted Almonds
(4, '2024-01-01', '2024-12-31', 120000, 'ACTIVE'),  -- Honey Roasted Peanuts
(5, '2024-01-01', '2024-12-31', 220000, 'ACTIVE');  -- Pistachio Kernels

-- Bảng provider_materials
CREATE TABLE IF NOT EXISTS provider_materials (
  provider_id BIGINT UNSIGNED NOT NULL,
  material_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (provider_id, material_id),
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (material_id) REFERENCES materials(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for provider_materials table
INSERT INTO provider_materials (provider_id, material_id) VALUES
(1, 1), -- Vietnam Nut Co. provides Cashews
(2, 2), -- US Almond Exports provides Almonds
(3, 3), -- Iran Pistachio Traders provides Pistachios
(4, 4), -- Aussie Macadamia Suppliers provides Macadamia
(5, 5); -- China Peanut Farms provides Peanuts

-- Bảng gift_sets
CREATE TABLE IF NOT EXISTS gift_sets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(255) UNIQUE DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for gift_sets table with all columns
INSERT INTO gift_sets (sku, name, image, description, status) VALUES
('GIFT-001', 'Tet Deluxe Nut Box', 'tet-deluxe-nut-box.jpg', 'Assorted premium nuts for Lunar New Year', 'ACTIVE'),
('GIFT-002', 'Prosperity Nut Hamper', 'prosperity-nut-hamper.jpg', 'Luxurious nut gift set for business partners', 'ACTIVE'),
('GIFT-003', 'Family Joy Nut Collection', 'family-joy-nut-collection.jpg', 'Variety of nuts and dried fruits for family gatherings', 'ACTIVE'),
('GIFT-004', 'Health & Wealth Nut Basket', 'health-wealth-nut-basket.jpg', 'Nutritious nut selection for health-conscious individuals', 'ACTIVE'),
('GIFT-005', 'Golden Fortune Nut Tin', 'golden-fortune-nut-tin.jpg', 'Elegant nut assortment in a reusable golden tin', 'ACTIVE');

-- Bảng gift_set_products
CREATE TABLE IF NOT EXISTS gift_set_products (
  gift_set_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (gift_set_id, product_id),
  FOREIGN KEY (gift_set_id) REFERENCES gift_sets(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for gift_set_products table
INSERT INTO gift_set_products (gift_set_id, product_id, quantity) VALUES
(1, 1, 2), -- 2 Roasted Cashews in Tet Deluxe Nut Box
(1, 2, 1), -- 1 Mixed Nuts in Tet Deluxe Nut Box
(2, 3, 2), -- 2 Salted Almonds in Prosperity Nut Hamper
(2, 5, 1), -- 1 Pistachio Kernels in Prosperity Nut Hamper
(3, 2, 2), -- 2 Mixed Nuts in Family Joy Nut Collection
(3, 4, 1), -- 1 Honey Roasted Peanuts in Family Joy Nut Collection
(4, 1, 1), -- 1 Roasted Cashews in Health & Wealth Nut Basket
(4, 3, 1), -- 1 Salted Almonds in Health & Wealth Nut Basket
(4, 5, 1), -- 1 Pistachio Kernels in Health & Wealth Nut Basket
(5, 1, 1), -- 1 Roasted Cashews in Golden Fortune Nut Tin
(5, 3, 1), -- 1 Salted Almonds in Golden Fortune Nut Tin
(5, 5, 1); -- 1 Pistachio Kernels in Golden Fortune Nut Tin

-- Bảng gift_set_prices
CREATE TABLE IF NOT EXISTS gift_set_prices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  gift_set_id BIGINT UNSIGNED NOT NULL,
  date_expiry DATE NOT NULL,
  price INT NOT NULL DEFAULT 0,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (gift_set_id) REFERENCES gift_sets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for gift_set_prices table
INSERT INTO gift_set_prices (gift_set_id, date_expiry, price, status) VALUES
(1, '2024-02-29 23:59:59', 750000, 'ACTIVE'),  -- Tet Deluxe Nut Box
(2, '2024-02-29 23:59:59', 1200000, 'ACTIVE'),  -- Prosperity Nut Hamper
(3, '2024-02-29 23:59:59', 650000, 'ACTIVE'),  -- Family Joy Nut Collection
(4, '2024-02-29 23:59:59', 850000, 'ACTIVE'),  -- Health & Wealth Nut Basket
(5, '2024-02-29 23:59:59', 950000, 'ACTIVE');  -- Golden Fortune Nut Tin

-- Bảng order_gift_sets
CREATE TABLE IF NOT EXISTS order_gift_sets (
  gift_set_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  PRIMARY KEY (order_id, gift_set_id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (gift_set_id) REFERENCES gift_sets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for order_gift_sets table
INSERT INTO order_gift_sets (gift_set_id, order_id, quantity, price) VALUES
(1, 3, 20, 750000),  -- 20 Tet Deluxe Nut Boxes for TechGiant Corp
(2, 5, 30, 1200000), -- 30 Prosperity Nut Hampers for Global Nut Distributors
(3, 4, 5, 650000),   -- 5 Family Joy Nut Collections for Nut Haven Boutique
(4, 2, 3, 850000),   -- 3 Health & Wealth Nut Baskets for NutLover Online
(5, 1, 10, 950000);  -- 10 Golden Fortune Nut Tins for MegaMart Chain

-- Bảng inventory_checks
CREATE TABLE IF NOT EXISTS inventory_checks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  storage_area_id BIGINT UNSIGNED NOT NULL,
  check_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE',
  note TEXT,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (storage_area_id) REFERENCES storage_areas(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for inventory_checks table
INSERT INTO inventory_checks (storage_area_id, check_date, status, created_by) VALUES
(1, '2024-01-05 09:00:00', 'ACTIVE', 1),  -- Main Nut Warehouse check
(2, '2024-01-10 10:00:00', 'ACTIVE', 2),  -- Processing Area check
(3, '2024-01-15 11:00:00', 'ACTIVE', 1), -- Gift Set Assembly check
(4, '2024-01-20 14:00:00', 'INACTIVE', 2),   -- Cold Storage check
(5, '2024-01-25 15:00:00', 'INACTIVE', 1);   -- Finished Product Storage check
    
-- Bảng inventory_check_details
CREATE TABLE IF NOT EXISTS inventory_check_details (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED,
  inventory_check_id BIGINT UNSIGNED NOT NULL,
  material_id BIGINT UNSIGNED,
  exact_quantity INT NOT NULL,
  actual_quantity INT,
  defective_quantity INT,
  error_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted BOOLEAN DEFAULT false,
  FOREIGN KEY (inventory_check_id) REFERENCES inventory_checks(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (material_id) REFERENCES materials(id),
  CONSTRAINT check_product_or_material CHECK (
    (product_id IS NOT NULL AND material_id IS NULL) OR
    (product_id IS NULL AND material_id IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for inventory_check_details table
INSERT INTO inventory_check_details (product_id, inventory_check_id, material_id, exact_quantity, actual_quantity) VALUES
(1, 1, NULL, 1000, 980),  -- Roasted Cashews in Main Warehouse
(2, 2, NULL, 500, 495),   -- Mixed Nuts in Processing Area
(NULL, 3, 3, 750, 740),   -- Salted Almonds in Gift Set Assembly
(NULL, 1, 4, 1200, 1190), -- Honey Roasted Peanuts in Main Warehouse
(NULL, 4, 5, 600, 600);   -- Pistachio Kernels in Cold Storage
    
-- Bảng inventory_history
CREATE TABLE IF NOT EXISTS inventory_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  storage_area_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED,
  material_id BIGINT UNSIGNED,
  quantity_before INT NOT NULL,
  quantity_change INT NOT NULL,
  quantity_after INT NOT NULL,
  remaining_quantity INT NOT NULL,
  action_type ENUM('IMPORT', 'EXPORT', 'CHECK') NOT NULL,
  reference_id BIGINT UNSIGNED,
  reference_type ENUM('IMPORT_RECEIPT', 'EXPORT_RECEIPT', 'INVENTORY_CHECK') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY (storage_area_id) REFERENCES storage_areas(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (material_id) REFERENCES materials(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT check_product_or_material_history CHECK (
    (product_id IS NOT NULL AND material_id IS NULL) OR
    (product_id IS NULL AND material_id IS NOT NULL)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Sample data for inventory_history table
INSERT INTO inventory_history (storage_area_id, product_id, material_id, quantity_before, quantity_change, quantity_after, remaining_quantity, action_type, reference_type, created_by) VALUES
(1, 1, NULL, 1000, -20, 980, 980, 'EXPORT', 'EXPORT_RECEIPT', 1),  -- Roasted Cashews export
(2, 2, NULL, 500, -5, 495, 495, 'EXPORT', 'EXPORT_RECEIPT', 2), -- Mixed Nuts to processing
(3, NULL, 3, 750, -10, 740, 740, 'EXPORT', 'EXPORT_RECEIPT', 1),  -- Salted Almonds to gift sets
(4, NULL, 5, 600, 0, 600, 600, 'CHECK', 'INVENTORY_CHECK', 2),    -- Pistachio Kernels inventory check
(5, NULL, 4, 1000, 190, 1190, 1190, 'IMPORT', 'IMPORT_RECEIPT', 1); -- Honey Roasted Peanuts from production

-- Indexes để tối ưu hiệu suất truy vấn
CREATE INDEX idx_customers_group_customer_id ON customers(group_customer_id);
CREATE INDEX idx_material_export_receipts_created_by ON material_export_receipts(created_by);
CREATE INDEX idx_material_import_receipts_provider_id ON material_import_receipts(provider_id);
CREATE INDEX idx_material_import_receipts_created_by ON material_import_receipts(created_by);
CREATE INDEX idx_material_import_receipts_approved_by ON material_import_receipts(approved_by);
CREATE INDEX idx_material_import_receipts_receiver_id ON material_import_receipts(receiver_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_product_export_receipts_created_by ON product_export_receipts(created_by);
CREATE INDEX idx_product_import_receipts_created_by ON product_import_receipts(created_by);
CREATE INDEX idx_product_import_receipts_receiver_id ON product_import_receipts(receiver_id);
CREATE INDEX idx_inventory_checks_storage_area_id ON inventory_checks(storage_area_id);
CREATE INDEX idx_inventory_checks_created_by ON inventory_checks(created_by);
CREATE INDEX idx_inventory_history_storage_area_id ON inventory_history(storage_area_id);
CREATE INDEX idx_inventory_history_created_by ON inventory_history(created_by);
CREATE INDEX idx_inventory_history_created_at ON inventory_history(created_at);

-- Xóa và thêm lại ràng buộc CASCADE cho bảng product_categories
ALTER TABLE product_categories
DROP FOREIGN KEY product_categories_ibfk_1;

ALTER TABLE product_categories
ADD CONSTRAINT product_categories_ibfk_1
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng product_discounts
ALTER TABLE product_discounts
DROP FOREIGN KEY product_discounts_ibfk_2;

ALTER TABLE product_discounts
ADD CONSTRAINT product_discounts_ibfk_2
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng provider_materials
ALTER TABLE provider_materials
DROP FOREIGN KEY provider_materials_ibfk_2;

ALTER TABLE provider_materials
ADD CONSTRAINT provider_materials_ibfk_2
FOREIGN KEY (material_id) 
REFERENCES materials(id) 
ON DELETE CASCADE;

ALTER TABLE provider_materials
DROP FOREIGN KEY provider_materials_ibfk_1;

ALTER TABLE provider_materials
ADD CONSTRAINT provider_materials_ibfk_1
FOREIGN KEY (provider_id) 
REFERENCES providers(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng material_categories
ALTER TABLE material_categories
DROP FOREIGN KEY material_categories_ibfk_1;

ALTER TABLE material_categories
ADD CONSTRAINT material_categories_ibfk_1
FOREIGN KEY (material_id) 
REFERENCES materials(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng category_discounts
ALTER TABLE category_discounts
DROP FOREIGN KEY category_discounts_ibfk_2;

ALTER TABLE category_discounts
ADD CONSTRAINT category_discounts_ibfk_2
FOREIGN KEY (category_id) 
REFERENCES categories(id) 
ON DELETE CASCADE;

ALTER TABLE category_discounts
DROP FOREIGN KEY category_discounts_ibfk_1;

ALTER TABLE category_discounts
ADD CONSTRAINT category_discounts_ibfk_1
FOREIGN KEY (discount_id) 
REFERENCES discounts(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng gift_set_products
ALTER TABLE gift_set_products
DROP FOREIGN KEY gift_set_products_ibfk_1;

ALTER TABLE gift_set_products
ADD CONSTRAINT gift_set_products_ibfk_1
FOREIGN KEY (gift_set_id) 
REFERENCES gift_sets(id) 
ON DELETE CASCADE;

ALTER TABLE gift_set_products
DROP FOREIGN KEY gift_set_products_ibfk_2;

ALTER TABLE gift_set_products
ADD CONSTRAINT gift_set_products_ibfk_2
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng order_details
ALTER TABLE order_details
DROP FOREIGN KEY order_details_ibfk_1;

ALTER TABLE order_details
ADD CONSTRAINT order_details_ibfk_1
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE CASCADE;

ALTER TABLE order_details
DROP FOREIGN KEY order_details_ibfk_2;

ALTER TABLE order_details
ADD CONSTRAINT order_details_ibfk_2
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng order_gift_sets
ALTER TABLE order_gift_sets
DROP FOREIGN KEY order_gift_sets_ibfk_1;

ALTER TABLE order_gift_sets
ADD CONSTRAINT order_gift_sets_ibfk_1
FOREIGN KEY (order_id) 
REFERENCES orders(id) 
ON DELETE CASCADE;

ALTER TABLE order_gift_sets
DROP FOREIGN KEY order_gift_sets_ibfk_2;

ALTER TABLE order_gift_sets
ADD CONSTRAINT order_gift_sets_ibfk_2
FOREIGN KEY (gift_set_id) 
REFERENCES gift_sets(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng material_storage_locations
ALTER TABLE material_storage_locations
DROP FOREIGN KEY material_storage_locations_ibfk_1;

ALTER TABLE material_storage_locations
ADD CONSTRAINT material_storage_locations_ibfk_1
FOREIGN KEY (material_id) 
REFERENCES materials(id) 
ON DELETE CASCADE;

-- Xóa và thêm lại ràng buộc CASCADE cho bảng product_storage_locations
ALTER TABLE product_storage_locations
DROP FOREIGN KEY product_storage_locations_ibfk_1;

ALTER TABLE product_storage_locations
ADD CONSTRAINT product_storage_locations_ibfk_1
FOREIGN KEY (product_id) 
REFERENCES products(id) 
ON DELETE CASCADE;