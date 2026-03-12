import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import the WebSocket hook we discussed
import { useWebSocket } from "@/hooks/useWebSocket"; 

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import NetworkPage from "./pages/dashboard/NetworkPage";
import DelaysPage from "./pages/dashboard/DelaysPage";
import RoutesPage from "./pages/dashboard/RoutesPage";
import CongestionPage from "./pages/dashboard/CongestionPage";
import TicketsPage from "./pages/dashboard/TicketsPage";
import AIAssistantPage from "./pages/dashboard/AIAssistantPage";
import ResiliencePage from "./pages/dashboard/ResiliencePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // This is the "Integration Master Stroke": 
  // The app starts listening to your Spring Boot WebSocket the moment it loads.
  useWebSocket(); 

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="network" element={<NetworkPage />} />
              <Route path="delays" element={<DelaysPage />} />
              <Route path="routes" element={<RoutesPage />} />
              <Route path="congestion" element={<CongestionPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="resilience" element={<ResiliencePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;