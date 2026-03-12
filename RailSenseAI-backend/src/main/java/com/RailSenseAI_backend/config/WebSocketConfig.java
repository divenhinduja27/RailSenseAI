package com.RailSenseAI_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // This is the prefix for the channel the frontend will "listen" to.
        // We will broadcast delay alerts to "/topic/network-updates"
        config.enableSimpleBroker("/topic");

        // This is the prefix for messages sent FROM the frontend TO the backend (optional for now)
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // This is the URL the frontend uses to establish the initial connection.
        // setAllowedOriginPatterns("*") is CRITICAL so your React teammate doesn't get CORS blocked.
        registry.addEndpoint("/ws-railway")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Fallback for browsers that don't support raw WebSockets
    }
}