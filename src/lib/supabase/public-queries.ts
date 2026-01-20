import { createClient } from "./client";
import type { CreateServiceOrderInput } from "./types";

export async function getTenantBySlug(slug: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching tenant:", error);
    return null;
  }

  return data;
}

export async function createPublicServiceOrder(
  tenantId: string,
  formData: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string | undefined;
    car_brand: string;
    car_model: string;
    car_year?: string | undefined;
    car_plate?: string | undefined;
    service_type: string;
    problem_description: string;
  }
) {
  const supabase = createClient();
  
  try {
    // 1. Create or find customer
    let customerId: string;
    
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("tenant_id", tenantId)
      .eq("phone", formData.customer_phone)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          tenant_id: tenantId,
          full_name: formData.customer_name,
          phone: formData.customer_phone,
          email: formData.customer_email,
        })
        .select()
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // 2. Create or find vehicle
    let vehicleId: string;
    
    if (formData.car_plate) {
      const { data: existingVehicle } = await supabase
        .from("vehicles")
        .select("id")
        .eq("tenant_id", tenantId)
        .eq("plate", formData.car_plate.toUpperCase())
        .single();

      if (existingVehicle) {
        vehicleId = existingVehicle.id;
      } else {
        const { data: newVehicle, error: vehicleError } = await supabase
          .from("vehicles")
          .insert({
            tenant_id: tenantId,
            customer_id: customerId,
            brand: formData.car_brand,
            model: formData.car_model,
            year: formData.car_year ? parseInt(formData.car_year) : null,
            plate: formData.car_plate.toUpperCase(),
          })
          .select()
          .single();

        if (vehicleError) throw vehicleError;
        vehicleId = newVehicle.id;
      }
    } else {
      // Create vehicle without plate
      const { data: newVehicle, error: vehicleError } = await supabase
        .from("vehicles")
        .insert({
          tenant_id: tenantId,
          customer_id: customerId,
          brand: formData.car_brand,
          model: formData.car_model,
          year: formData.car_year ? parseInt(formData.car_year) : null,
          plate: null,
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;
      vehicleId = newVehicle.id;
    }

    // 3. Generate order number and hash
    const orderNumber = `OS-${Date.now().toString(36).toUpperCase()}`;
    const clientHash = generateClientHash(formData.customer_name, orderNumber);

    // 4. Create service order
    const { data: serviceOrder, error: orderError } = await supabase
      .from("service_orders")
      .insert({
        tenant_id: tenantId,
        vehicle_id: vehicleId,
        customer_id: customerId,
        order_number: orderNumber,
        status: "entrada",
        urgency: "normal",
        problem_description: formData.problem_description,
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

    if (orderError) throw orderError;

    return serviceOrder;
  } catch (error) {
    console.error("Error creating public service order:", error);
    throw error;
  }
}

function generateClientHash(customerName?: string, orderNumber?: string): string {
  // Create a readable hash using customer name and order number
  const name = customerName?.replace(/\s+/g, '').toLowerCase().slice(0, 8) || 'client';
  const order = orderNumber?.replace(/[^a-zA-Z0-9]/g, '').slice(-4) || 'xxxx';
  const random = Math.random().toString(36).slice(2, 6);
  
  return `${name}-${order}-${random}`;
}
