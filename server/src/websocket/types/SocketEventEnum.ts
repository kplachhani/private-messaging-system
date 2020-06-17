export const enum socketEventEnum {
    connected = "connection",
    disconnected = "disconnect",
    emit = "emit",
    websocketMessage = "websocket_message",
    notification = "feeds:notification",
    notificationRead = "feeds:notification_read",
    notificationUser = "feeds:notification_user"
}