export type AppointmentMode = 'quick_service' | 'drop_off';

export type AppointmentStatus = 
  | 'scheduled'
  | 'received'
  | 'diagnosing'
  | 'quote_pending'
  | 'quote_approved'
  | 'waiting_parts'
  | 'in_repair'
  | 'testing'
  | 'completed'
  | 'delivered'
  | 'cancelled';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo_url?: string;
  primary_color: string;
  subscription_status: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
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
  updated_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  customer_id?: string;
  car_brand: string;
  car_model: string;
  car_year?: number;
  car_color?: string;
  car_plate?: string;
  service_type: string;
  problem_description?: string;
  appointment_mode: AppointmentMode;
  scheduled_date: string;
  scheduled_time?: string;
  status: AppointmentStatus;
  status_history: StatusHistoryEntry[];
  diagnosis?: string;
  quote_amount?: number;
  quote_approved_at?: string;
  final_amount?: number;
  assigned_technician_id?: string;
  payment_status: string;
  received_at?: string;
  started_at?: string;
  completed_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryEntry {
  status: AppointmentStatus;
  changed_at: string;
  changed_by?: string;
}

export interface ServiceOrder {
  id: string;
  tenant_id: string;
  appointment_id: string;
  order_number: string;
  services: ServiceItem[];
  parts_used: PartItem[];
  labor_cost: number;
  parts_cost: number;
  discount: number;
  total_amount: number;
  technician_notes?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
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

export interface AppointmentFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  car_brand: string;
  car_model: string;
  car_year?: string;
  car_plate?: string;
  service_type: string;
  problem_description?: string;
  appointment_mode: AppointmentMode;
  scheduled_date: string;
  scheduled_time?: string;
}

export const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bgClass: string }> = {
  scheduled: { label: 'Agendado', color: 'text-cobalt-blue', bgClass: 'bg-cobalt-blue/20 border-cobalt-blue/30' },
  received: { label: 'Recebido', color: 'text-electric-cyan', bgClass: 'bg-electric-cyan/20 border-electric-cyan/30' },
  diagnosing: { label: 'Em Diagnóstico', color: 'text-electric-cyan', bgClass: 'bg-electric-cyan/20 border-electric-cyan/30' },
  quote_pending: { label: 'Orçamento Pendente', color: 'text-warning-yellow', bgClass: 'bg-warning-yellow/20 border-warning-yellow/30' },
  quote_approved: { label: 'Orçamento Aprovado', color: 'text-neon-green', bgClass: 'bg-neon-green/20 border-neon-green/30' },
  waiting_parts: { label: 'Aguardando Peça', color: 'text-pending-orange', bgClass: 'bg-pending-orange/20 border-pending-orange/30' },
  in_repair: { label: 'Em Reparo', color: 'text-warning-yellow', bgClass: 'bg-warning-yellow/20 border-warning-yellow/30' },
  testing: { label: 'Teste de Rodagem', color: 'text-electric-cyan', bgClass: 'bg-electric-cyan/20 border-electric-cyan/30' },
  completed: { label: 'Concluído', color: 'text-neon-green', bgClass: 'bg-neon-green/20 border-neon-green/30' },
  delivered: { label: 'Entregue', color: 'text-neon-green', bgClass: 'bg-neon-green/20 border-neon-green/30' },
  cancelled: { label: 'Cancelado', color: 'text-red-500', bgClass: 'bg-red-500/20 border-red-500/30' },
};

export const TIMELINE_STEPS: AppointmentStatus[] = [
  'received',
  'quote_pending',
  'in_repair',
  'testing',
  'completed',
];
