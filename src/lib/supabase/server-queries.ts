import { createClient } from "./server";
import type { ServiceOrder } from "./types";

export async function getServiceOrderByHash(hash: string): Promise<ServiceOrder | null> {
  const supabase = await createClient();
  
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
