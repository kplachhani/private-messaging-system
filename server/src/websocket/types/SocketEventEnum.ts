export const enum socketEventEnum {
    connected = "connection",
    disconnected = "disconnect",
    emit = "emit",
    websocketMessage = "websocket_message",

    activeUsers = "active_users",
    listenMessage = "listen_room",
    emitRoom = "emit_room",
    joinRoom = "join_room",
    leaveRoom = "leave_room",
    activateE2ERoom = "activate_E2E",
    triggerE2ERoom = "trigger_E2E",
}