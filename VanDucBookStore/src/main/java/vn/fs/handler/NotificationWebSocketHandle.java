package vn.fs.handler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class NotificationWebSocketHandle extends TextWebSocketHandler {

	private final List<WebSocketSession> webSocketSessions = Collections.synchronizedList(new ArrayList<>());

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		webSocketSessions.add(session);
	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		broadcast(message.getPayload());
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		webSocketSessions.remove(session);
	}

	public void broadcast(String message) {
		synchronized (webSocketSessions) {
			for (WebSocketSession session : webSocketSessions) {
				if (session != null && session.isOpen()) {
					try {
						session.sendMessage(new TextMessage(message));
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		}
	}

}
