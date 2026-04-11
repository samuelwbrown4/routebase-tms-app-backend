CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE role AS ENUM ('admin', 'user');
CREATE TYPE order_status AS ENUM ('unplanned', 'planned', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE shipment_status AS ENUM ('built', 'planned', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE shipment_events_type AS ENUM ('picked_up', 'in_transit', 'delivered' , 'comment');
CREATE TYPE contract_status AS ENUM ('pending' ,'active', 'expired' , 'rejected', 'terminated');

CREATE TABLE companies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE carriers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scac VARCHAR(10) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE supplier_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL,
    CONSTRAINT fk_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE customer_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE shipper_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    erp_id VARCHAR(4) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE shipper_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id UUID NOT NULL,
    erp_id VARCHAR(4) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role role NOT NULL,
    CONSTRAINT fk_location_id FOREIGN KEY (location_id) REFERENCES shipper_locations(id)
);

CREATE TABLE carrier_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    carrier_id UUID NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role role NOT NULL,
    CONSTRAINT fk_carrier_id FOREIGN KEY (carrier_id) REFERENCES carriers(id)
);

CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    material_number VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    freight_class VARCHAR(10) NOT NULL,
    unit_of_measure VARCHAR(10) NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE equipment_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    max_weight DECIMAL(10, 2) NOT NULL,
    mode VARCHAR(50) NOT NULL
);

CREATE TABLE shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_number VARCHAR(255) NOT NULL UNIQUE,
    origin_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    carrier_id UUID NOT NULL,
    equipment_type_id UUID NOT NULL,
    status shipment_status NOT NULL,
    total_weight DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requested_pickup_date DATE NOT NULL,
    requested_delivery_date DATE NOT NULL,
    actual_pickup_date DATE,
    actual_delivery_date DATE,
    planned_by_user_id UUID NOT NULL,
    CONSTRAINT fk_origin_id FOREIGN KEY (origin_id) REFERENCES shipper_locations(id),
    CONSTRAINT fk_destination_id FOREIGN KEY (destination_id) REFERENCES customer_locations(id),
    CONSTRAINT fk_carrier_id FOREIGN KEY (carrier_id) REFERENCES carriers(id),
    CONSTRAINT fk_planned_by_user_id FOREIGN KEY (planned_by_user_id) REFERENCES shipper_users(id),
    CONSTRAINT fk_equipment_type_id FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id)
);

CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL,
    origin_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    customer_po_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    requested_ship_date DATE NOT NULL,
    order_status order_status NOT NULL,
    CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_origin_id FOREIGN KEY (origin_id) REFERENCES shipper_locations(id),
    CONSTRAINT fk_destination_id FOREIGN KEY (destination_id) REFERENCES customer_locations(id)
);

CREATE TABLE order_line_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INT NOT NULL,
    total_weight_lbs DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);



CREATE TABLE shipment_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID NOT NULL,
    event_type shipment_events_type NOT NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    user_id UUID,
    CONSTRAINT fk_shipment_id FOREIGN KEY (shipment_id) REFERENCES shipments(id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES carrier_users(id)
);

CREATE TABLE shipment_orders (
    shipment_id UUID NOT NULL,
    order_id UUID NOT NULL UNIQUE,
    PRIMARY KEY (shipment_id, order_id),
    CONSTRAINT fk_shipment_id FOREIGN KEY (shipment_id) REFERENCES shipments(id),
    CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE rate_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    carrier_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    CONSTRAINT fk_carrier_id FOREIGN KEY (carrier_id) REFERENCES carriers(id)
);

CREATE TABLE rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID NOT NULL,
    min_distance DECIMAL(10, 2) NOT NULL,
    max_distance DECIMAL(10, 2),
    flat_rate DECIMAL(10, 2) NOT NULL,
    per_mile_rate DECIMAL(10, 2) NOT NULL,
    fuel_surcharge_percentage DECIMAL(5, 2) NOT NULL,
    CONSTRAINT fk_package_id FOREIGN KEY (package_id) REFERENCES rate_packages(id)
);

CREATE TABLE contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL,
    carrier_id UUID NOT NULL,
    package_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_status contract_status DEFAULT 'pending' NOT NULL,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_carrier_id FOREIGN KEY (carrier_id) REFERENCES carriers(id),
    CONSTRAINT fk_package_id FOREIGN KEY (package_id) REFERENCES rate_packages(id)
);


