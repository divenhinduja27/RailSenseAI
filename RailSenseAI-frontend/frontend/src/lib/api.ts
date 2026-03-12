import axios from 'axios';

// Unified Base URL for the RailSense Engine
const BASE_URL = '/api/v1/rail-intelligence';

// Create a clean instance. We let Axios handle the Content-Type automatically 
// to avoid strict-header mismatches in Spring Boot.
const api = axios.create({
  timeout: 10000, // 10s timeout for complex Neo4j queries
});

export const railApi = {
  // --- Infrastructure & Topology ---
  getTopology: () => 
    api.get(`${BASE_URL}/dashboard/topology`).then(r => r.data),

  // --- Operational Simulations ---
  runSimulation: (stationCode: string, delayMinutes: number) => 
    api.post(`${BASE_URL}/simulate/cascade`, { stationCode, delayMinutes }).then(r => r.data),

  getSimulationHistory: () => 
    api.get(`${BASE_URL}/simulation/history`).then(r => r.data),

  resetNetwork: () => 
    api.post(`${BASE_URL}/simulation/reset`).then(r => r.data),

  // --- Analytics & Resilience ---
  getResilience: (sourceCode: string, targetCode: string) => 
    api.get(`${BASE_URL}/analytics/resilience-report`, { 
      params: { sourceCode, targetCode } 
    }).then(r => r.data),

  getHotspots: () => 
    api.get(`${BASE_URL}/analytics/congestion-hotspots`).then(r => r.data),

  // --- Passenger Intelligence ---
  getTicketOdds: (trainNo: string, wl: number, stationCode: string) => 
    api.get(`${BASE_URL}/passenger/ticket-odds`, { 
      params: { trainNo, wl, stationCode } 
    }).then(r => r.data),

  // --- AI Intelligence (SLM) ---
  chatWithAI: async (query: string) => {
    const response = await api.post(`${BASE_URL}/ai/chat`, { query });
    // Ensure we handle the response map correctly based on your NetworkController
    return response.data.response;
  }
};