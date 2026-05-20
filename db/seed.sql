-- ============================================================
-- TMS App Seed Data
-- ============================================================
-- All passwords are 'Password123!'
-- Hash: $2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6
-- ============================================================


-- ------------------------------------------------------------
-- EQUIPMENT TYPES
-- ------------------------------------------------------------
INSERT INTO equipment_types (id, name, max_weight, mode) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Dry Van',  44000.00, 'TL'),
  ('a1000000-0000-0000-0000-000000000002', 'Flatbed',  48000.00, 'TL'),
  ('a1000000-0000-0000-0000-000000000003', 'Reefer',   43500.00, 'TL'),
  ('a1000000-0000-0000-0000-000000000004', 'LTL',      10000.00, 'LTL');


-- ------------------------------------------------------------
-- CARRIERS
-- ------------------------------------------------------------
INSERT INTO carriers (id, name, scac, address) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'TrueFlow Logistics', 'TRUL', '4821 Commerce Blvd, Kansas City, MO 64108'),
  ('b1000000-0000-0000-0000-000000000002', 'ZenPulse Freight',   'ZPFR', '9300 Industrial Pkwy, Dallas, TX 75201');


-- ------------------------------------------------------------
-- CARRIER USERS
-- ------------------------------------------------------------
INSERT INTO carrier_users (id, carrier_id, first_name, last_name, email, phone_number, password_hash, role, newUser) VALUES
  ('a5000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Robert',  'Kincaid',  'r.kincaid@trueflow.com',  '816-555-0201', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('a5000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Denise',  'Hargrove', 'd.hargrove@trueflow.com', '816-555-0202', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('a5000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Marcus',  'Deleon',   'm.deleon@zenpulse.com',   '214-555-0203', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('a5000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Tamara',  'Osei',     't.osei@zenpulse.com',     '214-555-0204', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false);


-- ------------------------------------------------------------
-- COMPANIES
-- ------------------------------------------------------------
INSERT INTO companies (id, name, address) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'PurePath Inc.',  '1200 Health Sciences Dr, Omaha, NE 68102'),
  ('c1000000-0000-0000-0000-000000000002', 'Nexora',         '500 Tech Center Dr, Orlando, FL 32801');


-- ------------------------------------------------------------
-- SHIPPER LOCATIONS (with lat/lng)
-- ------------------------------------------------------------
INSERT INTO shipper_locations (id, company_id, erp_id, name, address, city, state, zip_code, country, latitude, longitude) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'PP01', 'PurePath Omaha',    '1200 Health Sciences Dr', 'Omaha',    'NE', '68102', 'USA',  41.257160, -95.994820),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'PP02', 'PurePath New York', '350 Fifth Ave',           'New York', 'NY', '10118', 'USA',  40.748440, -73.985664),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'PP03', 'PurePath Seattle',  '1730 Minor Ave',          'Seattle',  'WA', '98101', 'USA',  47.615310, -122.335960),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'NX01', 'Nexora Orlando',    '500 Tech Center Dr',      'Orlando',  'FL', '32801', 'USA',  28.538340, -81.379230),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'NX02', 'Nexora Columbus',   '100 E Broad St',          'Columbus', 'OH', '43215', 'USA',  39.961200, -82.998780),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'NX03', 'Nexora Phoenix',    '2201 E Camelback Rd',     'Phoenix',  'AZ', '85016', 'USA',  33.509770, -112.031270);


-- ------------------------------------------------------------
-- SHIPPER USERS
-- ------------------------------------------------------------
INSERT INTO shipper_users (id, location_id, erp_id, first_name, last_name, email, phone_number, password_hash, role, newUser) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'U001', 'Laura',    'Hensley',   'l.hensley@purepath.com',   '402-555-0101', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'U002', 'Marcus',   'Tran',      'm.tran@purepath.com',       '402-555-0102', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'U003', 'Diana',    'Kowalski',  'd.kowalski@purepath.com',  '402-555-0103', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'U004', 'James',    'Okafor',    'j.okafor@purepath.com',    '402-555-0104', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000002', 'U005', 'Rachel',   'Goldstein', 'r.goldstein@purepath.com', '212-555-0105', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'U006', 'Carlos',   'Reyes',     'c.reyes@purepath.com',     '212-555-0106', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'U007', 'Priya',    'Nair',      'p.nair@purepath.com',      '212-555-0107', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000002', 'U008', 'Kevin',    'Marsh',     'k.marsh@purepath.com',     '212-555-0108', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000003', 'U009', 'Sandra',   'Yuen',      's.yuen@purepath.com',      '206-555-0109', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000003', 'U010', 'Derek',    'Paulson',   'd.paulson@purepath.com',   '206-555-0110', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000003', 'U011', 'Megan',    'Flores',    'm.flores@purepath.com',    '206-555-0111', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000003', 'U012', 'Tony',     'Whitfield', 't.whitfield@purepath.com', '206-555-0112', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000013', 'd1000000-0000-0000-0000-000000000004', 'U013', 'Angela',   'Morrison',  'a.morrison@nexora.com',    '407-555-0113', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000014', 'd1000000-0000-0000-0000-000000000004', 'U014', 'Brian',    'Nakamura',  'b.nakamura@nexora.com',    '407-555-0114', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000015', 'd1000000-0000-0000-0000-000000000004', 'U015', 'Tiffany',  'Bowers',    't.bowers@nexora.com',      '407-555-0115', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000016', 'd1000000-0000-0000-0000-000000000004', 'U016', 'Omar',     'Khalil',    'o.khalil@nexora.com',      '407-555-0116', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000017', 'd1000000-0000-0000-0000-000000000005', 'U017', 'Nicole',   'Hartman',   'n.hartman@nexora.com',     '614-555-0117', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000018', 'd1000000-0000-0000-0000-000000000005', 'U018', 'Jason',    'Webb',      'j.webb@nexora.com',        '614-555-0118', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000019', 'd1000000-0000-0000-0000-000000000005', 'U019', 'Vanessa',  'Choi',      'v.choi@nexora.com',        '614-555-0119', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000020', 'd1000000-0000-0000-0000-000000000005', 'U020', 'Patrick',  'Givens',    'p.givens@nexora.com',      '614-555-0120', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000021', 'd1000000-0000-0000-0000-000000000006', 'U021', 'Christine','Delgado',   'c.delgado@nexora.com',     '480-555-0121', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'admin', false),
  ('e1000000-0000-0000-0000-000000000022', 'd1000000-0000-0000-0000-000000000006', 'U022', 'Andre',    'Simpson',   'a.simpson@nexora.com',     '480-555-0122', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000023', 'd1000000-0000-0000-0000-000000000006', 'U023', 'Leslie',   'Park',      'l.park@nexora.com',        '480-555-0123', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false),
  ('e1000000-0000-0000-0000-000000000024', 'd1000000-0000-0000-0000-000000000006', 'U024', 'Trevor',   'Odom',      't.odom@nexora.com',        '480-555-0124', '$2b$10$sVbr.iBbVIjIIIjGgpWMXeCmaPmcHcswaVxlPWDAKqup7o33PkmE6', 'user', false);


-- ------------------------------------------------------------
-- CUSTOMERS
-- ------------------------------------------------------------
INSERT INTO customers (id, company_id, name, address, city, state, zip_code, country) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Houston Methodist Hospital',   '6565 Fannin St',       'Houston',     'TX', '77030', 'USA'),
  ('f1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Mayo Clinic',                  '200 First St SW',      'Rochester',   'MN', '55905', 'USA'),
  ('f1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Cedars-Sinai Medical Center',  '8700 Beverly Blvd',    'Los Angeles', 'CA', '90048', 'USA'),
  ('f1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Massachusetts General',        '55 Fruit St',          'Boston',      'MA', '02114', 'USA'),
  ('f1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Emory University Hospital',    '1364 Clifton Rd NE',   'Atlanta',     'GA', '30322', 'USA'),
  ('f1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Coresite Denver',              '910 15th St',          'Denver',      'CO', '80202', 'USA'),
  ('f1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'CyrusOne Dallas',              '1649 W Frankford Rd',  'Carrollton',  'TX', '75007', 'USA'),
  ('f1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000002', 'QTS Chicago',                  '2800 S River Rd',      'Des Plaines', 'IL', '60018', 'USA'),
  ('f1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000002', 'Equinix Seattle',              '2020 5th Ave',         'Seattle',     'WA', '98121', 'USA'),
  ('f1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000002', 'Switch Las Vegas',             '7135 S Decatur Blvd',  'Las Vegas',   'NV', '89118', 'USA');


-- ------------------------------------------------------------
-- CUSTOMER LOCATIONS (with lat/lng)
-- ------------------------------------------------------------
INSERT INTO customer_locations (id, customer_id, name, address, city, state, zip_code, country, latitude, longitude) VALUES
  ('a2000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'Houston Methodist - Receiving', '6565 Fannin St',      'Houston',     'TX', '77030', 'USA',  29.710650, -95.397320),
  ('a2000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000002', 'Mayo Clinic - Receiving',       '200 First St SW',     'Rochester',   'MN', '55905', 'USA',  44.022450, -92.466630),
  ('a2000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000003', 'Cedars-Sinai - Receiving',      '8700 Beverly Blvd',   'Los Angeles', 'CA', '90048', 'USA',  34.075820, -118.380600),
  ('a2000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000004', 'Mass General - Receiving',      '55 Fruit St',         'Boston',      'MA', '02114', 'USA',  42.363560, -71.068970),
  ('a2000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000005', 'Emory University - Receiving',  '1364 Clifton Rd NE',  'Atlanta',     'GA', '30322', 'USA',  33.798840, -84.325310),
  ('a2000000-0000-0000-0000-000000000006', 'f1000000-0000-0000-0000-000000000006', 'Coresite Denver - Dock A',      '910 15th St',         'Denver',      'CO', '80202', 'USA',  39.744210, -104.995370),
  ('a2000000-0000-0000-0000-000000000007', 'f1000000-0000-0000-0000-000000000007', 'CyrusOne Dallas - Dock B',      '1649 W Frankford Rd', 'Carrollton',  'TX', '75007', 'USA',  32.988010, -96.900450),
  ('a2000000-0000-0000-0000-000000000008', 'f1000000-0000-0000-0000-000000000008', 'QTS Chicago - Dock C',          '2800 S River Rd',     'Des Plaines', 'IL', '60018', 'USA',  41.887970, -87.869040),
  ('a2000000-0000-0000-0000-000000000009', 'f1000000-0000-0000-0000-000000000009', 'Equinix Seattle - Receiving',   '2020 5th Ave',        'Seattle',     'WA', '98121', 'USA',  47.612490, -122.336150),
  ('a2000000-0000-0000-0000-000000000010', 'f1000000-0000-0000-0000-000000000010', 'Switch Las Vegas - Dock A',     '7135 S Decatur Blvd', 'Las Vegas',   'NV', '89118', 'USA',  36.054940, -115.219730);







  -- ============================================================
-- Rate Packages, Rates & Contracts Seed Data
-- ============================================================
-- Carriers:
--   b1000000-...-001  TrueFlow Logistics (Kansas City, MO)
--   b1000000-...-002  ZenPulse Freight   (Dallas, TX)
--
-- Companies:
--   c1000000-...-001  PurePath Inc.  (Omaha, NE)
--   c1000000-...-002  Nexora         (Orlando, FL)
--
-- Packages:
--   TrueFlow  ->  Standard 2026, Preferred 2026
--   ZenPulse  ->  Standard 2026, Preferred 2026
--
-- Contracts:
--   PurePath  ->  Preferred from both carriers (high volume)
--   Nexora    ->  Standard from both carriers
--   One expired contract each for historical data
-- ============================================================


-- ------------------------------------------------------------
-- RATE PACKAGES
-- ------------------------------------------------------------
INSERT INTO rate_packages (id, carrier_id, name) VALUES

  -- TrueFlow Logistics
  ('aa000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Standard 2026'),
  ('aa000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Preferred 2026'),

  -- ZenPulse Freight
  ('aa000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Standard 2026'),
  ('aa000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Preferred 2026');


-- ------------------------------------------------------------
-- RATES (distance bands per package)
-- TrueFlow cheaper on short hauls
-- ZenPulse cheaper on long hauls
-- Preferred packages have lower per_mile_rate and fuel surcharge
-- ------------------------------------------------------------
INSERT INTO rates (id, package_id, min_distance, max_distance, flat_rate, per_mile_rate, fuel_surcharge_percentage) VALUES

  -- TrueFlow Standard 2026
  ('bb000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001',    0.00,  499.99, 150.00, 2.95, 19.00),
  ('bb000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000001',  500.00,  749.99, 175.00, 2.65, 18.25),
  ('bb000000-0000-0000-0000-000000000003', 'aa000000-0000-0000-0000-000000000001',  750.00, 1199.99, 200.00, 2.35, 17.50),
  ('bb000000-0000-0000-0000-000000000004', 'aa000000-0000-0000-0000-000000000001', 1200.00,    NULL, 225.00, 2.05, 17.00),

  -- TrueFlow Preferred 2026
  ('bb000000-0000-0000-0000-000000000005', 'aa000000-0000-0000-0000-000000000002',    0.00,  499.99, 150.00, 2.75, 17.50),
  ('bb000000-0000-0000-0000-000000000006', 'aa000000-0000-0000-0000-000000000002',  500.00,  749.99, 175.00, 2.45, 16.75),
  ('bb000000-0000-0000-0000-000000000007', 'aa000000-0000-0000-0000-000000000002',  750.00, 1199.99, 200.00, 2.15, 16.25),
  ('bb000000-0000-0000-0000-000000000008', 'aa000000-0000-0000-0000-000000000002', 1200.00,    NULL, 225.00, 1.90, 15.75),

  -- ZenPulse Standard 2026
  ('bb000000-0000-0000-0000-000000000009', 'aa000000-0000-0000-0000-000000000003',    0.00,  499.99, 175.00, 3.05, 19.50),
  ('bb000000-0000-0000-0000-000000000010', 'aa000000-0000-0000-0000-000000000003',  500.00,  749.99, 185.00, 2.70, 18.75),
  ('bb000000-0000-0000-0000-000000000011', 'aa000000-0000-0000-0000-000000000003',  750.00, 1199.99, 190.00, 2.30, 18.00),
  ('bb000000-0000-0000-0000-000000000012', 'aa000000-0000-0000-0000-000000000003', 1200.00,    NULL, 200.00, 1.95, 17.25),

  -- ZenPulse Preferred 2026
  ('bb000000-0000-0000-0000-000000000013', 'aa000000-0000-0000-0000-000000000004',    0.00,  499.99, 175.00, 2.85, 18.00),
  ('bb000000-0000-0000-0000-000000000014', 'aa000000-0000-0000-0000-000000000004',  500.00,  749.99, 185.00, 2.50, 17.25),
  ('bb000000-0000-0000-0000-000000000015', 'aa000000-0000-0000-0000-000000000004',  750.00, 1199.99, 190.00, 2.10, 16.75),
  ('bb000000-0000-0000-0000-000000000016', 'aa000000-0000-0000-0000-000000000004', 1200.00,    NULL, 200.00, 1.75, 16.00);
  
-- ------------------------------------------------------------
-- CONTRACTS
-- ------------------------------------------------------------
INSERT INTO contracts (id, company_id, carrier_id, package_id, start_date, end_date, contract_status) VALUES

  -- PurePath x TrueFlow Preferred (active)
  ('cc000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000002', '2026-01-01', '2026-12-31', 'active'),

  -- PurePath x TrueFlow Standard (expired - prior year)
  ('cc000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', '2025-01-01', '2025-12-31', 'expired'),

  -- PurePath x ZenPulse Preferred (active)
  ('cc000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000004', '2026-01-01', '2026-12-31', 'active'),

  -- Nexora x TrueFlow Standard (active)
  ('cc000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'aa000000-0000-0000-0000-000000000001', '2026-01-01', '2026-12-31', 'active'),

  -- Nexora x ZenPulse Standard (active)
  ('cc000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000003', '2026-02-01', '2027-01-31', 'active'),

  -- Nexora x ZenPulse Standard (expired - prior year)
  ('cc000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'aa000000-0000-0000-0000-000000000003', '2025-02-01', '2026-01-31', 'expired');