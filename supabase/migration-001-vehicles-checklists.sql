-- Migration 001: Add vehicles and checklists tables
-- Run this after the initial schema.sql

-- ============================================
-- VEHICLES (Veículos cadastrados)
-- ============================================
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Vehicle info
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER,
    color VARCHAR(50),
    plate VARCHAR(20) NOT NULL,
    chassis VARCHAR(50),
    engine VARCHAR(100),
    fuel_type VARCHAR(50), -- gasoline, ethanol, flex, diesel, electric
    mileage INTEGER,
    
    -- Additional info
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, plate)
);

-- ============================================
-- CHECKLISTS (Checklist de entrada)
-- ============================================
CREATE TABLE checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    
    -- Checklist type
    type VARCHAR(50) DEFAULT 'entry', -- entry, exit
    
    -- Exterior condition
    exterior_condition JSONB DEFAULT '{
        "front_bumper": {"status": "ok", "notes": ""},
        "rear_bumper": {"status": "ok", "notes": ""},
        "hood": {"status": "ok", "notes": ""},
        "trunk": {"status": "ok", "notes": ""},
        "roof": {"status": "ok", "notes": ""},
        "left_front_door": {"status": "ok", "notes": ""},
        "left_rear_door": {"status": "ok", "notes": ""},
        "right_front_door": {"status": "ok", "notes": ""},
        "right_rear_door": {"status": "ok", "notes": ""},
        "left_mirror": {"status": "ok", "notes": ""},
        "right_mirror": {"status": "ok", "notes": ""},
        "windshield": {"status": "ok", "notes": ""},
        "rear_window": {"status": "ok", "notes": ""},
        "left_headlight": {"status": "ok", "notes": ""},
        "right_headlight": {"status": "ok", "notes": ""},
        "left_taillight": {"status": "ok", "notes": ""},
        "right_taillight": {"status": "ok", "notes": ""}
    }',
    
    -- Tires condition
    tires_condition JSONB DEFAULT '{
        "front_left": {"brand": "", "condition": "ok", "depth": ""},
        "front_right": {"brand": "", "condition": "ok", "depth": ""},
        "rear_left": {"brand": "", "condition": "ok", "depth": ""},
        "rear_right": {"brand": "", "condition": "ok", "depth": ""},
        "spare": {"brand": "", "condition": "ok", "depth": ""}
    }',
    
    -- Interior condition
    interior_condition JSONB DEFAULT '{
        "seats": {"status": "ok", "notes": ""},
        "dashboard": {"status": "ok", "notes": ""},
        "steering_wheel": {"status": "ok", "notes": ""},
        "gear_shift": {"status": "ok", "notes": ""},
        "air_conditioning": {"status": "ok", "notes": ""},
        "radio": {"status": "ok", "notes": ""},
        "floor_mats": {"status": "ok", "notes": ""}
    }',
    
    -- Levels
    fluid_levels JSONB DEFAULT '{
        "engine_oil": "ok",
        "coolant": "ok",
        "brake_fluid": "ok",
        "power_steering": "ok",
        "windshield_washer": "ok"
    }',
    
    -- Items in vehicle
    items_in_vehicle JSONB DEFAULT '{
        "documents": false,
        "spare_tire": false,
        "jack": false,
        "wheel_wrench": false,
        "triangle": false,
        "fire_extinguisher": false,
        "first_aid_kit": false
    }',
    
    -- Fuel level (0-100)
    fuel_level INTEGER DEFAULT 50,
    
    -- Current mileage
    mileage INTEGER,
    
    -- Photos (URLs)
    photos JSONB DEFAULT '[]',
    
    -- Signature
    customer_signature TEXT,
    technician_signature TEXT,
    
    -- Notes
    general_notes TEXT,
    
    -- Completed
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Update service_orders to link to vehicles
-- ============================================
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'entrada';
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS urgency VARCHAR(20) DEFAULT 'normal';
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS problem_description TEXT;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS received_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE service_orders ADD COLUMN IF NOT EXISTS client_hash VARCHAR(64);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_checklists_service_order ON checklists(service_order_id);
CREATE INDEX idx_checklists_vehicle ON checklists(vehicle_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_service_orders_client_hash ON service_orders(client_hash);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

-- Public can view service orders by hash (for client tracking)
CREATE POLICY "Public can view by hash" ON service_orders
    FOR SELECT USING (client_hash IS NOT NULL);

-- ============================================
-- Triggers
-- ============================================
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Insert demo tenant for testing
-- ============================================
INSERT INTO tenants (id, name, slug, email, phone)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'AutoTech Oficina Demo',
    'oficina-demo',
    'demo@autotech.com',
    '(11) 99999-0000'
) ON CONFLICT (slug) DO NOTHING;
