import SocketServer from "socket.io"
import { ERROR_CODES } from "../constants/GlobalConstant"
import AuthHelper from "../helpers/AuthHelper"
import UserModel from "../models/UserModel"

const UsersOnline = {}
const initSocket = server => {
    const io = SocketServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    io.use(async (socket, next) => {
        const bearerToken = socket.handshake.headers.authorization || socket.request.headers.authorization
        const [_, token] = bearerToken.split(" ")
        const isValidToken = await AuthHelper.verifyAccessToken(token)
        if (!isValidToken) {
            const err = new Error("Unauthorized")
            err.data = {
                code: 401,
                errors: [ERROR_CODES.ERROR_UNAUTHORIZED]
            }
            return next(err)
        }
        console.log("OK Authorized")
        return next()
    })
    global.io = io
    global.UsersOnline = UsersOnline
    console.log("+Socket.io Server running...")

    io.on("connection", socket => {
        console.log(`Socket ID:${socket.id} is connect: URL: ${socket.request.url}, METHOD: ${socket.request.method}`)
        socket.on("startOnline", async data => {
            const { userId } = data
            socket.userId = userId
            UsersOnline[userId] = socket.id
            const updateData = { isOnline: true }
            await UserModel.updateOne({ _id: userId }, { $set: updateData })
            console.log("UsersOnline", UsersOnline)
            console.log("socket.id", socket.id)
            io.sockets.emit("onStartOnline", { UsersOnline })
        })

        socket.on("sendMessage", message => {
            const { members = [] } = message.conversation
            const senderId = message.sender.id
            members.forEach(memberId => {
                const socketId = UsersOnline[memberId] || ""
                if (socketId && memberId !== senderId) {
                    socket.to(socketId).emit("onMessages", message)
                }
            })
        })

        /* when the clients emits 'typing', we broadcast it to others */
        socket.on("chatTyping", data => {
            const { members = [], senderId } = data
            members.forEach(memberId => {
                const socketId = UsersOnline[memberId] || ""
                if (socketId && memberId !== senderId) socket.to(socketId).emit("onChatTyping", data)
            })
        })

        /* when the client emits 'stop typing', we broadcast it to others */
        socket.on("chatStopTyping", data => {
            const { members = [], senderId } = data
            members.forEach(memberId => {
                const socketId = UsersOnline[memberId] || ""
                if (socketId && memberId !== senderId) socket.to(socketId).emit("onChatStopTyping", data)
            })
        })

        socket.on("disconnect", async () => {
            console.log(`${socket.id} disconnect !!!`)
            delete UsersOnline[socket.userId]
            console.log("socket.userId", socket.userId)
            const updateData = { isOnline: false }
            /* update user online */
            await UserModel.updateOne({ _id: socket.userId }, { $set: updateData })
            console.log("UsersOnline", UsersOnline)
        })
    })
}
export default { initSocket }
