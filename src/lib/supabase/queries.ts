import { createClient } from "./client";
import type { ServiceOrder, Vehicle, Customer, KanbanStatus, CreateServiceOrderInput } from "./types";

const DEMO_TENANT_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

// Generate a unique hash for client tracking
function generateClientHash(customerName?: string, orderNumber?: string): string {
  // Create a readable hash using customer name and order number
  const name = customerName?.replace(/\s+/g, '').toLowerCase().slice(0, 8) || 'client';
  const order = orderNumber?.replace(/[^a-zA-Z0-9]/g, '').slice(-4) || 'xxxx';
  const random = Math.random().toString(36).slice(2, 6);
  
  return `${name}-${order}-${random}`;
}

// Generate order number
async function generateOrderNumber(supabase: ReturnType<typeof createClient>): Promise<string> {
  const year = new Date().getFullYear();
  
  const { count } = await supabase
    .from("service_orders")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", DEMO_TENANT_ID)
    .gte("created_at", `${year}-01-01`);
  
  const num = (count || 0) + 1;
  return `OS-${year}-${num.toString().padStart(4, "0")}`;
}

// ============================================
// SERVICE ORDERS
// ============================================

export async function getServiceOrders(tenantId?: string): Promise<ServiceOrder[]> {
  const supabase = createClient();
  
  let query = supabase
    .from("service_orders")
    .select(`
      *,
      vehicle:vehicles(*),
      customer:customers(*)
    `)
    .order("created_at", { ascending: false });

  // Filter by tenant if provided
  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  } else {
    // Default to demo tenant for backward compatibility
    query = query.eq("tenant_id", DEMO_TENANT_ID);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching service orders:", error);
    return [];
  }

  return data || [];
}

export async function getServiceOrderByHash(hash: string): Promise<ServiceOrder | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("service_orders")
    .select(`
      *,
      vehicle:vehicles(*),
      customer:customers(*)
    `)
    .eq("client_hash", hash)
    .single();

  if (error) {
    console.error("Error fetching service order by hash:", error);
    return null;
  }

  return data;
}

export async function createServiceOrder(input: CreateServiceOrderInput): Promise<ServiceOrder | null> {
  const supabase = createClient();
  
  console.log("Creating service order with input:", input);
  
  try {
    // 1. Create or find customer
    let customerId: string;
    
    const { data: existingCustomer, error: findCustomerError } = await supabase
      .from("customers")
      .select("id")
      .eq("tenant_id", DEMO_TENANT_ID)
      .eq("phone", input.customer_phone)
      .single();

    console.log("Find customer result:", { existingCustomer, findCustomerError });

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          tenant_id: DEMO_TENANT_ID,
          full_name: input.customer_name,
          phone: input.customer_phone,
          email: input.customer_email,
        })
        .select()
        .single();

      console.log("Create customer result:", { newCustomer, customerError });
      
      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // 2. Create or find vehicle
    let vehicleId: string;
    
    const { data: existingVehicle, error: findVehicleError } = await supabase
      .from("vehicles")
      .select("id")
      .eq("tenant_id", DEMO_TENANT_ID)
      .eq("plate", input.vehicle_plate.toUpperCase())
      .single();

    console.log("Find vehicle result:", { existingVehicle, findVehicleError });

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
      if (input.vehicle_mileage) {
        await supabase
          .from("vehicles")
          .update({ mileage: input.vehicle_mileage })
          .eq("id", vehicleId);
      }
    } else {
      const { data: newVehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert({
          tenant_id: DEMO_TENANT_ID,
          customer_id: customerId,
          brand: input.vehicle_brand,
          model: input.vehicle_model,
          year: input.vehicle_year,
          color: input.vehicle_color,
          plate: input.vehicle_plate.toUpperCase(),
          mileage: input.vehicle_mileage,
        })
        .select()
        .single();

      console.log("Create vehicle result:", { newVehicle, vehicleError });
      
      if (vehicleError) throw vehicleError;
      vehicleId = newVehicle.id;
    }

    // 3. Generate order number and hash
    const orderNumber = await generateOrderNumber(supabase);
    const clientHash = generateClientHash(input.customer_name, orderNumber);

    // 4. Create service order
    console.log("Creating service order with:", { orderNumber, clientHash, vehicleId, customerId });
    
    const { data: serviceOrder, error: orderError } = await supabase
      .from("service_orders")
      .insert({
        tenant_id: DEMO_TENANT_ID,
        vehicle_id: vehicleId,
        customer_id: customerId,
        order_number: orderNumber,
        status: "entrada",
        urgency: input.urgency,
        problem_description: input.problem_description,
        client_hash: clientHash,
        received_at: new Date().toISOString(),
        services: [],
        parts_used: [],
        labor_cost: 0,
        parts_cost: 0,
        discount: 0,
        total_amount: 0,
      })
      .select(`
        *,
        vehicle:vehicles(*),
        customer:customers(*)
      `)
      .single();

    console.log("Create service order result:", { serviceOrder, orderError });

    if (orderError) throw orderError;

    console.log("Service order created successfully:", serviceOrder);
    return serviceOrder;
  } catch (error) {
    console.error("Error creating service order:", error);
    alert("Erro ao criar OS: " + (error as Error).message);
    return null;
  }
}

export async function updateServiceOrderStatus(
  orderId: string,
  newStatus: KanbanStatus
): Promise<boolean> {
  const supabase = createClient();
  
  const updates: Record<string, unknown> = {
    status: newStatus,
  };

  // Update timestamps based on status
  if (newStatus === "execucao") {
    updates.started_at = new Date().toISOString();
  } else if (newStatus === "finalizado") {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("service_orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating service order status:", error);
    return false;
  }

  return true;
}

export async function updateServiceOrder(
  orderId: string,
  updates: Partial<ServiceOrder>
): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("service_orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    console.error("Error updating service order:", error);
    return false;
  }

  return true;
}

export async function deleteServiceOrder(orderId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("service_orders")
    .delete()
    .eq("id", orderId);

  if (error) {
    console.error("Error deleting service order:", error);
    return false;
  }

  return true;
}

// ============================================
// VEHICLES
// ============================================

export async function searchVehicleByPlate(plate: string): Promise<Vehicle | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      customer:customers(*)
    `)
    .eq("tenant_id", DEMO_TENANT_ID)
    .eq("plate", plate.toUpperCase())
    .single();

  if (error) {
    return null;
  }

  return data;
}

// ============================================
// CUSTOMERS
// ============================================

export async function searchCustomerByPhone(phone: string): Promise<Customer | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("tenant_id", DEMO_TENANT_ID)
    .eq("phone", phone)
    .single();

  if (error) {
    return null;
  }

  return data;
}
