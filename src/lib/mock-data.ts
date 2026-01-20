export type KanbanStatus = "entrada" | "orcamento" | "execucao" | "finalizado";
export type Urgency = "normal" | "alta" | "urgente";

export interface ServiceOrderKanban {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  carYear: number;
  carPlate: string;
  serviceType: string;
  problemDescription?: string;
  status: KanbanStatus;
  urgency: Urgency;
  quoteAmount?: number;
  assignedTo?: string;
  createdAt: string;
  receivedAt?: string;
  estimatedCompletion?: string;
}

export const KANBAN_COLUMNS: { id: KanbanStatus; title: string; color: string }[] = [
  { id: "entrada", title: "Entrada", color: "electric-cyan" },
  { id: "orcamento", title: "Orçamento", color: "warning-yellow" },
  { id: "execucao", title: "Em Execução", color: "pending-orange" },
  { id: "finalizado", title: "Finalizado", color: "neon-green" },
];

export const MOCK_ORDERS: ServiceOrderKanban[] = [
  {
    id: "os_001",
    orderNumber: "OS-2024-0047",
    customerName: "João Silva",
    customerPhone: "(11) 99999-1234",
    carBrand: "Toyota",
    carModel: "Corolla",
    carYear: 2022,
    carPlate: "ABC-1234",
    serviceType: "Revisão completa",
    problemDescription: "Revisão dos 30.000km",
    status: "entrada",
    urgency: "normal",
    createdAt: "2024-01-20T08:00:00",
    receivedAt: "2024-01-20T08:30:00",
  },
  {
    id: "os_002",
    orderNumber: "OS-2024-0048",
    customerName: "Maria Santos",
    customerPhone: "(11) 98888-5678",
    carBrand: "Honda",
    carModel: "Civic",
    carYear: 2021,
    carPlate: "XYZ-5678",
    serviceType: "Troca de freios",
    problemDescription: "Barulho ao frear, possível pastilha gasta",
    status: "entrada",
    urgency: "alta",
    createdAt: "2024-01-20T09:00:00",
  },
  {
    id: "os_003",
    orderNumber: "OS-2024-0045",
    customerName: "Pedro Costa",
    customerPhone: "(11) 97777-4321",
    carBrand: "Volkswagen",
    carModel: "Golf",
    carYear: 2020,
    carPlate: "DEF-9012",
    serviceType: "Diagnóstico motor",
    problemDescription: "Luz do motor acesa, perda de potência",
    status: "orcamento",
    urgency: "urgente",
    quoteAmount: 1850.0,
    createdAt: "2024-01-19T14:00:00",
    receivedAt: "2024-01-19T14:30:00",
  },
  {
    id: "os_004",
    orderNumber: "OS-2024-0044",
    customerName: "Ana Oliveira",
    customerPhone: "(11) 96666-8765",
    carBrand: "Chevrolet",
    carModel: "Onix",
    carYear: 2023,
    carPlate: "GHI-3456",
    serviceType: "Troca de óleo",
    status: "orcamento",
    urgency: "normal",
    quoteAmount: 350.0,
    createdAt: "2024-01-19T11:00:00",
    receivedAt: "2024-01-19T11:15:00",
  },
  {
    id: "os_005",
    orderNumber: "OS-2024-0042",
    customerName: "Carlos Ferreira",
    customerPhone: "(11) 95555-2109",
    carBrand: "Fiat",
    carModel: "Argo",
    carYear: 2022,
    carPlate: "JKL-7890",
    serviceType: "Suspensão dianteira",
    problemDescription: "Barulho na suspensão ao passar em buracos",
    status: "execucao",
    urgency: "alta",
    quoteAmount: 2200.0,
    assignedTo: "Marcos",
    createdAt: "2024-01-18T10:00:00",
    receivedAt: "2024-01-18T10:30:00",
    estimatedCompletion: "2024-01-20T18:00:00",
  },
  {
    id: "os_006",
    orderNumber: "OS-2024-0040",
    customerName: "Lucia Mendes",
    customerPhone: "(11) 94444-6543",
    carBrand: "Hyundai",
    carModel: "HB20",
    carYear: 2021,
    carPlate: "MNO-1234",
    serviceType: "Ar condicionado",
    problemDescription: "AC não gela",
    status: "execucao",
    urgency: "normal",
    quoteAmount: 800.0,
    assignedTo: "João",
    createdAt: "2024-01-17T16:00:00",
    receivedAt: "2024-01-17T16:30:00",
  },
  {
    id: "os_007",
    orderNumber: "OS-2024-0038",
    customerName: "Roberto Alves",
    customerPhone: "(11) 93333-0987",
    carBrand: "Jeep",
    carModel: "Renegade",
    carYear: 2020,
    carPlate: "PQR-5678",
    serviceType: "Embreagem",
    status: "finalizado",
    urgency: "urgente",
    quoteAmount: 3500.0,
    assignedTo: "Marcos",
    createdAt: "2024-01-15T09:00:00",
    receivedAt: "2024-01-15T09:30:00",
  },
  {
    id: "os_008",
    orderNumber: "OS-2024-0036",
    customerName: "Fernanda Lima",
    customerPhone: "(11) 92222-4321",
    carBrand: "Nissan",
    carModel: "Kicks",
    carYear: 2022,
    carPlate: "STU-9012",
    serviceType: "Alinhamento e balanceamento",
    status: "finalizado",
    urgency: "normal",
    quoteAmount: 180.0,
    assignedTo: "João",
    createdAt: "2024-01-16T14:00:00",
    receivedAt: "2024-01-16T14:15:00",
  },
];

export const DASHBOARD_STATS = {
  todayOrders: 5,
  inProgress: 4,
  waitingParts: 1,
  completedToday: 2,
  weekRevenue: 12850.0,
  avgCompletionTime: "4.2h",
};
