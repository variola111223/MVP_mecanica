-- AutoTech SaaS - Database Schema
-- Multi-tenant auto repair shop management system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TENANTS (Oficinas)
-- ============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL path: autotech.com/{slug}
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#00E5FF',
    stripe_account_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'trial',
    subscription_plan VARCHAR(50) DEFAULT 'starter',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS (Funcionários da oficina)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'technician', -- admin, manager, technician
    avatar_url TEXT,
    auth_user_id UUID, -- Reference to Supabase Auth
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS (Clientes)
-- ============================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    document_number VARCHAR(20), -- CPF/CNPJ
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS (Agendamentos)
-- ============================================
CREATE TYPE appointment_mode AS ENUM ('quick_service', 'drop_off');
CREATE TYPE appointment_status AS ENUM (
    'scheduled',      -- Agendado
    'received',       -- Recebido
    'diagnosing',     -- Em Diagnóstico
    'quote_pending',  -- Orçamento Pendente
    'quote_approved', -- Orçamento Aprovado
    'waiting_parts',  -- Aguardando Peça
    'in_repair',      -- Em Reparo
    'testing',        -- Teste de Rodagem
    'completed',      -- Concluído
    'delivered',      -- Entregue
    'cancelled'       -- Cancelado
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Vehicle info (without prior registration)
    car_brand VARCHAR(100) NOT NULL,
    car_model VARCHAR(100) NOT NULL,
    car_year INTEGER,
    car_color VARCHAR(50),
    car_plate VARCHAR(20),
    
    -- Appointment details
    service_type VARCHAR(255) NOT NULL, -- Described by customer
    problem_description TEXT,
    appointment_mode appointment_mode NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    
    -- Status tracking
    status appointment_status DEFAULT 'scheduled',
    status_history JSONB DEFAULT '[]',
    
    -- Service details (filled by technician)
    diagnosis TEXT,
    quote_amount DECIMAL(10, 2),
    quote_approved_at TIMESTAMP WITH TIME ZONE,
    final_amount DECIMAL(10, 2),
    
    -- Technician assignment
    assigned_technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    
    -- Timestamps
    received_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICE_ORDERS (Ordens de Serviço)
-- ============================================
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    
    order_number VARCHAR(20) NOT NULL, -- OS-2024-0001
    
    -- Services performed
    services JSONB DEFAULT '[]', -- [{name, description, price, quantity}]
    parts_used JSONB DEFAULT '[]', -- [{name, code, price, quantity}]
    
    -- Financial
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    parts_cost DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    
    -- Notes
    technician_notes TEXT,
    internal_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tenant_id, order_number)
);

-- ============================================
-- NOTIFICATIONS (Email logs)
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL, -- status_update, quote_ready, completed, etc
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT,
    
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_customers_tenant ON customers(tenant_id);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_service_orders_tenant ON service_orders(tenant_id);
CREATE INDEX idx_service_orders_number ON service_orders(order_number);
CREATE INDEX idx_notifications_appointment ON notifications(appointment_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies for multi-tenant isolation (example for tenants table)
CREATE POLICY "Users can view their own tenant" ON tenants
    FOR SELECT USING (
        id IN (SELECT tenant_id FROM users WHERE auth_user_id = auth.uid())
    );

-- Policies for appointments (public read for tracking)
CREATE POLICY "Public can view appointments by ID" ON appointments
    FOR SELECT USING (true);

CREATE POLICY "Tenant users can manage appointments" ON appointments
    FOR ALL USING (
        tenant_id IN (SELECT tenant_id FROM users WHERE auth_user_id = auth.uid())
    );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON service_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number(p_tenant_id UUID)
RETURNS VARCHAR AS $$
DECLARE
    v_year VARCHAR(4);
    v_count INTEGER;
    v_number VARCHAR(20);
BEGIN
    v_year := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    SELECT COUNT(*) + 1 INTO v_count
    FROM service_orders
    WHERE tenant_id = p_tenant_id
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());
    
    v_number := 'OS-' || v_year || '-' || LPAD(v_count::VARCHAR, 4, '0');
    
    RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update appointment status with history
CREATE OR REPLACE FUNCTION update_appointment_status(
    p_appointment_id UUID,
    p_new_status appointment_status,
    p_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_history JSONB;
BEGIN
    SELECT status_history INTO v_history FROM appointments WHERE id = p_appointment_id;
    
    v_history := v_history || jsonb_build_object(
        'status', p_new_status,
        'changed_at', NOW(),
        'changed_by', p_user_id
    );
    
    UPDATE appointments
    SET 
        status = p_new_status,
        status_history = v_history,
        received_at = CASE WHEN p_new_status = 'received' THEN NOW() ELSE received_at END,
        started_at = CASE WHEN p_new_status = 'in_repair' THEN NOW() ELSE started_at END,
        completed_at = CASE WHEN p_new_status = 'completed' THEN NOW() ELSE completed_at END,
        delivered_at = CASE WHEN p_new_status = 'delivered' THEN NOW() ELSE delivered_at END
    WHERE id = p_appointment_id;
END;
$$ LANGUAGE plpgsql;
