// Mock data for the railway intelligence platform

export interface Station {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  zone: string;
  congestionLevel: number; // 0-100
  platforms: number;
  dailyTrains: number;
}

export interface TrainRoute {
  id: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  status: "on-time" | "delayed" | "cancelled";
  delayMinutes: number;
  occupancy: number; // percentage
  confirmationProbability: number; // percentage
}

export interface DelayEvent {
  id: string;
  trainNumber: string;
  trainName: string;
  station: string;
  delayMinutes: number;
  reason: string;
  cascadeRisk: "low" | "medium" | "high" | "critical";
  affectedTrains: number;
  timestamp: string;
}

export interface StatsData {
  totalTrains: number;
  activeTrains: number;
  delayedTrains: number;
  onTimePercentage: number;
  totalPassengers: string;
  avgDelay: number;
  congestionHotspots: number;
  networkHealth: number;
}

export const stations: Station[] = [
  { id: "1", name: "New Delhi", code: "NDLS", lat: 28.6139, lng: 77.2090, zone: "NR", congestionLevel: 85, platforms: 16, dailyTrains: 350 },
  { id: "2", name: "Mumbai CST", code: "CSTM", lat: 18.9398, lng: 72.8354, zone: "CR", congestionLevel: 92, platforms: 18, dailyTrains: 420 },
  { id: "3", name: "Howrah Junction", code: "HWH", lat: 22.5839, lng: 88.3428, zone: "ER", congestionLevel: 78, platforms: 23, dailyTrains: 380 },
  { id: "4", name: "Chennai Central", code: "MAS", lat: 13.0827, lng: 80.2707, zone: "SR", congestionLevel: 71, platforms: 12, dailyTrains: 280 },
  { id: "5", name: "Bangalore City", code: "SBC", lat: 12.9716, lng: 77.5946, zone: "SWR", congestionLevel: 65, platforms: 10, dailyTrains: 190 },
  { id: "6", name: "Secunderabad", code: "SC", lat: 17.4344, lng: 78.5013, zone: "SCR", congestionLevel: 60, platforms: 10, dailyTrains: 220 },
  { id: "7", name: "Lucknow", code: "LKO", lat: 26.8467, lng: 80.9462, zone: "NR", congestionLevel: 55, platforms: 9, dailyTrains: 180 },
  { id: "8", name: "Jaipur Junction", code: "JP", lat: 26.9124, lng: 75.7873, zone: "NWR", congestionLevel: 50, platforms: 6, dailyTrains: 140 },
  { id: "9", name: "Ahmedabad", code: "ADI", lat: 23.0225, lng: 72.5714, zone: "WR", congestionLevel: 58, platforms: 12, dailyTrains: 210 },
  { id: "10", name: "Pune Junction", code: "PUNE", lat: 18.5293, lng: 73.8568, zone: "CR", congestionLevel: 62, platforms: 6, dailyTrains: 160 },
  { id: "11", name: "Patna Junction", code: "PNBE", lat: 25.6, lng: 85.1, zone: "ECR", congestionLevel: 72, platforms: 10, dailyTrains: 200 },
  { id: "12", name: "Bhopal Junction", code: "BPL", lat: 23.26, lng: 77.41, zone: "WCR", congestionLevel: 48, platforms: 6, dailyTrains: 170 },
];

export const trainRoutes: TrainRoute[] = [
  { id: "1", trainNumber: "12301", trainName: "Rajdhani Express", from: "NDLS", to: "HWH", departureTime: "16:55", arrivalTime: "09:55", status: "on-time", delayMinutes: 0, occupancy: 94, confirmationProbability: 72 },
  { id: "2", trainNumber: "12951", trainName: "Mumbai Rajdhani", from: "NDLS", to: "CSTM", departureTime: "16:35", arrivalTime: "08:35", status: "delayed", delayMinutes: 45, occupancy: 98, confirmationProbability: 35 },
  { id: "3", trainNumber: "12259", trainName: "Duronto Express", from: "NDLS", to: "SBC", departureTime: "20:10", arrivalTime: "06:10", status: "on-time", delayMinutes: 0, occupancy: 87, confirmationProbability: 58 },
  { id: "4", trainNumber: "12621", trainName: "Tamil Nadu Express", from: "NDLS", to: "MAS", departureTime: "22:30", arrivalTime: "07:10", status: "delayed", delayMinutes: 120, occupancy: 91, confirmationProbability: 45 },
  { id: "5", trainNumber: "12903", trainName: "Golden Temple Mail", from: "CSTM", to: "ADI", departureTime: "21:00", arrivalTime: "05:20", status: "on-time", delayMinutes: 0, occupancy: 76, confirmationProbability: 82 },
  { id: "6", trainNumber: "12425", trainName: "Jammu Rajdhani", from: "NDLS", to: "JP", departureTime: "20:20", arrivalTime: "04:45", status: "on-time", delayMinutes: 0, occupancy: 68, confirmationProbability: 90 },
  { id: "7", trainNumber: "12839", trainName: "Howrah-Chennai Mail", from: "HWH", to: "MAS", departureTime: "23:50", arrivalTime: "04:35", status: "delayed", delayMinutes: 30, occupancy: 82, confirmationProbability: 65 },
  { id: "8", trainNumber: "12627", trainName: "Karnataka Express", from: "NDLS", to: "SBC", departureTime: "21:15", arrivalTime: "06:40", status: "cancelled", delayMinutes: 0, occupancy: 0, confirmationProbability: 0 },
  { id: "9", trainNumber: "12723", trainName: "Telangana Express", from: "NDLS", to: "SC", departureTime: "06:50", arrivalTime: "05:40", status: "on-time", delayMinutes: 0, occupancy: 79, confirmationProbability: 70 },
  { id: "10", trainNumber: "12002", trainName: "Bhopal Shatabdi", from: "NDLS", to: "BPL", departureTime: "06:15", arrivalTime: "14:30", status: "on-time", delayMinutes: 0, occupancy: 88, confirmationProbability: 55 },
];

export const delayEvents: DelayEvent[] = [
  { id: "1", trainNumber: "12951", trainName: "Mumbai Rajdhani", station: "Kota Junction", delayMinutes: 45, reason: "Signal failure at Kota", cascadeRisk: "high", affectedTrains: 12, timestamp: "2026-03-12T08:30:00" },
  { id: "2", trainNumber: "12621", trainName: "Tamil Nadu Express", station: "Agra Cantt", delayMinutes: 120, reason: "Track maintenance", cascadeRisk: "critical", affectedTrains: 18, timestamp: "2026-03-12T07:15:00" },
  { id: "3", trainNumber: "12839", trainName: "Howrah-Chennai Mail", station: "Vijayawada", delayMinutes: 30, reason: "Heavy fog conditions", cascadeRisk: "medium", affectedTrains: 5, timestamp: "2026-03-12T09:00:00" },
  { id: "4", trainNumber: "18477", trainName: "Kalinga Utkal Exp", station: "Bhubaneswar", delayMinutes: 60, reason: "Platform congestion", cascadeRisk: "medium", affectedTrains: 8, timestamp: "2026-03-12T06:45:00" },
  { id: "5", trainNumber: "12505", trainName: "North East Express", station: "Mughal Sarai", delayMinutes: 90, reason: "Engine failure", cascadeRisk: "high", affectedTrains: 14, timestamp: "2026-03-12T05:20:00" },
  { id: "6", trainNumber: "12311", trainName: "Kalka Mail", station: "Allahabad", delayMinutes: 15, reason: "Unscheduled stop", cascadeRisk: "low", affectedTrains: 2, timestamp: "2026-03-12T10:10:00" },
];

export const statsData: StatsData = {
  totalTrains: 13452,
  activeTrains: 8934,
  delayedTrains: 1247,
  onTimePercentage: 86.1,
  totalPassengers: "23.4M",
  avgDelay: 18.5,
  congestionHotspots: 34,
  networkHealth: 91,
};

export const networkConnections = [
  { from: "NDLS", to: "JP" },
  { from: "NDLS", to: "LKO" },
  { from: "NDLS", to: "BPL" },
  { from: "JP", to: "ADI" },
  { from: "BPL", to: "PUNE" },
  { from: "PUNE", to: "CSTM" },
  { from: "ADI", to: "CSTM" },
  { from: "LKO", to: "PNBE" },
  { from: "PNBE", to: "HWH" },
  { from: "BPL", to: "SC" },
  { from: "SC", to: "SBC" },
  { from: "SBC", to: "MAS" },
  { from: "HWH", to: "MAS" },
  { from: "SC", to: "MAS" },
  { from: "NDLS", to: "SC" },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const sampleChatResponses: Record<string, string> = {
  "delay": "Based on current network analysis, **Kota Junction** and **Agra Cantt** are the most vulnerable stations today. The signal failure at Kota is causing cascading delays affecting 12+ trains on the Delhi-Mumbai corridor. I recommend rerouting via Ajmer for westbound traffic.",
  "congestion": "Current congestion hotspots:\n\n1. **Mumbai CST** — 92% capacity (peak hours)\n2. **New Delhi** — 85% capacity\n3. **Howrah Junction** — 78% capacity\n\nMumbai CST is predicted to exceed capacity by 15:00 today. Suggest diverting 3 suburban services to Dadar terminal.",
  "ticket": "For the **Delhi → Mumbai Rajdhani (12951)** on March 15:\n\n- Current waitlist position: WL/45\n- **Confirmation probability: 35%** (Low)\n- Recommended booking window: 7-10 days in advance\n- Alternative: **Duronto Express (12259)** has 58% confirmation probability\n\nI suggest booking the Duronto or trying Tatkal quota.",
  "default": "I'm your Railway Intelligence Assistant. I can help with:\n\n• **Delay predictions** — cascade analysis & vulnerable stations\n• **Congestion monitoring** — real-time hotspot detection\n• **Ticket guidance** — confirmation probabilities & smart booking\n• **Route optimization** — alternative routes & scheduling\n\nWhat would you like to know?",
};
