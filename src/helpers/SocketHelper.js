class SocketHelper {
    sendNotify({ userId, notify }) {
        const socketIds = global.UsersOnline[`${userId.toString()}`] || []
        socketIds.forEach(socketId => {
            if (socketId) {
                global.io.to(socketId).emit("onNotifications", notify)
            }
        })
    }

    sendHire({ userId, hire }) {
        const socketIds = global.UsersOnline[`${userId.toString()}`] || []
        socketIds.forEach(socketId => {
            if (socketId) {
                global.io.to(socketId).emit("onHires", hire)
            }
        })
    }
}

export default new SocketHelper()
