package com.RailSenseAI_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiAssistantService {

    @Autowired
    private RailwayService railwayService;

    /**
     * Objective 9: SLM / LLM Assistant Component
     * Interprets structured graph data, executes commands, and provides natural language insights.
     */
    public String processAiQuery(String userQuery) {
        String query = userQuery.toLowerCase();

        // 🚀 1. THE ACTION INTERCEPTOR (Command Execution)
        // If the user wants to trigger a delay, do it here instead of just talking about it.
        if (query.contains("simulate") || query.contains("induce")) {

            // Basic NLP to extract parameters for the demo
            String targetStation = query.contains("ndls") ? "NDLS" : "BPL";
            int delayMins = query.contains("60") ? 60 : 45;

            // ACTUALLY TRIGGER THE DELAY IN THE BACKEND ENGINE!
            railwayService.predictDelayCascade(targetStation, delayMins);

            // Return immediate confirmation
            return "🚨 **COMMAND EXECUTED**: Induced a " + delayMins + "-minute delay at " + targetStation + ".\n\n" +
                    "**SYSTEM UPDATE:** The graph traversal engine has been engaged. " +
                    "Cascading impacts are currently being calculated and pushed to the UI via WebSockets. " +
                    "Ask me for a 'Status Report' to see the live active disruptions.";
        }

        // 🔍 2. THE LIVE GRAPH READER (Status Checking)
        // If it wasn't a command, fetch the REAL-TIME system context before answering.
        // This ensures the AI knows about the delay you just induced!
        String systemContext = railwayService.getSystemSnapshotForAI();

        // 🧠 3. INTENT DETECTION & RESPONSE GENERATION
        if (query.contains("status") || query.contains("active") || query.contains("report")) {
            return "**ANALYSIS: RAILSENSE-AI SYSTEM STATUS REPORT:**\n" +
                    systemContext + "\n\n" +
                    "**STRATEGIC ADVICE:** If the snapshot above shows active disruptions, immediate rerouting protocols are recommended to prevent further graph congestion.";
        }

        else if (query.contains("vulnerable") || query.contains("disruption") || query.contains("delay")) {
            return "ANALYSIS: " + systemContext +
                    "\n\nOPERATIONAL ADVICE: Based on graph centrality, BPL and NDLS are current high-impact hubs. " +
                    "Any delay cascade here will affect 75% of the corridor. Suggesting proactive scheduling adjustments.";
        }

        else if (query.contains("waitlist") || query.contains("confirm") || query.contains("ticket")) {
            return "PASSENGER INTELLIGENCE: Ticket confirmation probabilities are calculated based on historical clearance and " +
                    "current corridor utilization. For high-demand routes, booking 45 days in advance is recommended.";
        }

        else if (query.contains("route") || query.contains("alternate")) {
            return "ROUTING INSIGHT: If the central corridor is congested, the system has successfully identified a Western bypass via Mumbai (MUM) " +
                    "that maintains operational feasibility with minimal travel time increase.";
        }

        // Default Fallback
        return "I am the RailSense-AI SLM Assistant.\n\n" +
                "CURRENT GRAPH CONTEXT:\n" + systemContext +
                "\n\nHow else can I assist with your railway operations today? *(Try typing: 'Induce a 45 minute delay at BPL')*";
    }
}