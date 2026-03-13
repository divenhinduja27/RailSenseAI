import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/rail-intelligence';

const api = axios.create({
  timeout: 10000
});

export const railApi = {

  // --- Graph Topology ---
  getTopology: () =>
    api.get(`${BASE_URL}/dashboard/topology`).then(r => r.data),

  // --- Delay Simulation (AI) ---
  runSimulation: (stationCode: string, delayMinutes: number) =>
    api.post(`${BASE_URL}/simulate/cascade`, { stationCode, delayMinutes })
      .then(r => r.data),

  getSimulationHistory: () =>
    api.get(`${BASE_URL}/simulation/history`).then(r => r.data),

  resetNetwork: () =>
    api.post(`${BASE_URL}/simulation/reset`).then(r => r.data),

  // --- AI Route Planning ---
  getSmartRoute: (sourceCode: string, targetCode: string) =>
    api.get(`${BASE_URL}/passenger/route-planner`, {
      params: { sourceCode, targetCode }
    }).then(r => r.data),

  // --- AI Network Intelligence ---
  getResilience: (sourceCode: string, targetCode: string) =>
    api.get(`${BASE_URL}/analytics/resilience-report`, {
      params: { sourceCode, targetCode }
    }).then(r => r.data),

  getHotspots: () =>
    api.get(`${BASE_URL}/analytics/congestion-hotspots`)
      .then(r => r.data),

  // --- Passenger Prediction ---
  getTicketOdds: (trainNo: string, wl: number, stationCode: string) =>
    api.get(`${BASE_URL}/passenger/ticket-odds`, {
      params: { trainNo, wl, stationCode }
    }).then(r => r.data),

  // --- AI Assistant ---
  chatWithAI: async (query: string) => {
    const response = await api.post(`${BASE_URL}/ai/chat`, { query });
    return response.data.response;
  }
};