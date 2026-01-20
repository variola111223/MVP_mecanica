export type KanbanStatus = "entrada" | "orcamento" | "execucao" | "finalizado";
export type Urgency = "normal" | "alta" | "urgente";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  primary_color?: string;
  created_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  full_name: string;
  email?: string;
  phone: string;
  document_number?: string;
  address?: string;
  notes?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  tenant_id: string;
  customer_id?: string;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  plate: string;
  chassis?: string;
  engine?: string;
  fuel_type?: string;
  mileage?: number;
  notes?: string;
  created_at: string;
  // Joined data
  customer?: Customer;
}

export interface ServiceOrder {
  id: string;
  tenant_id: string;
  appointment_id?: string;
  vehicle_id?: string;
  customer_id?: string;
  order_number: string;
  status: KanbanStatus;
  urgency: Urgency;
  problem_description?: string;
  diagnosis?: string;
  services: ServiceItem[];
  parts_used: PartItem[];
  labor_cost: number;
  parts_cost: number;
  discount: number;
  total_amount: number;
  technician_notes?: string;
  internal_notes?: string;
  assigned_to?: string;
  client_hash?: string;
  received_at?: string;
  started_at?: string;
  completed_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  vehicle?: Vehicle;
  customer?: Customer;
}

export interface ServiceItem {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface PartItem {
  name: string;
  code?: string;
  price: number;
  quantity: number;
}

export interface Checklist {
  id: string;
  tenant_id: string;
  service_order_id: string;
  vehicle_id?: string;
  type: "entry" | "exit";
  exterior_condition: Record<string, { status: string; notes: string }>;
  tires_condition: Record<string, { brand: string; condition: string; depth: string }>;
  interior_condition: Record<string, { status: string; notes: string }>;
  fluid_levels: Record<string, string>;
  items_in_vehicle: Record<string, boolean>;
  fuel_level: number;
  mileage?: number;
  photos: string[];
  customer_signature?: string;
  technician_signature?: string;
  general_notes?: string;
  completed_at?: string;
  completed_by?: string;
  created_at: string;
}

// Form types
export interface CreateServiceOrderInput {
  // Customer
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  // Vehicle
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year?: number;
  vehicle_color?: string;
  vehicle_plate: string;
  vehicle_mileage?: number;
  // Service
  problem_description: string;
  urgency: Urgency;
}

// Kanban columns config
export const KANBAN_COLUMNS = [
  { id: "entrada" as KanbanStatus, title: "Entrada", color: "electric-cyan" },
  { id: "orcamento" as KanbanStatus, title: "Orçamento", color: "warning-yellow" },
  { id: "execucao" as KanbanStatus, title: "Em Execução", color: "pending-orange" },
  { id: "finalizado" as KanbanStatus, title: "Finalizado", color: "neon-green" },
] as const;
