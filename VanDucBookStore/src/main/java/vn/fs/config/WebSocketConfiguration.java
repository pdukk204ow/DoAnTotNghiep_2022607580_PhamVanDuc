package vn.fs.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import vn.fs.handler.NotificationWebSocketHandle;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

	private final static String NOTIFICATION_ENDPOINT = "/notification";

	@Autowired
	private NotificationWebSocketHandle notificationWebSocketHandle;

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
		webSocketHandlerRegistry.addHandler(notificationWebSocketHandle, NOTIFICATION_ENDPOINT)
				.setAllowedOrigins("*");
	}

}
