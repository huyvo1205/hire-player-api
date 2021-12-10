import WebSocket from "ws"
import { broadcastPipeline } from "./pipeline"

const setupWebSocket = server => {
    const wss = new WebSocket.Server({ noServer: true })

    server.on("upgrade", (request, socket, head) => {
        try {
            wss.handleUpgrade(request, socket, head, ws => {
                wss.emit("connection", ws, request)
            })
        } catch (err) {
            console.log("upgrade exception", err)
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
            socket.destroy()
        }
    })

    broadcastPipeline(wss.clients)

    wss.on("connection", ctx => {
        console.log("connected", wss.clients.size)

        ctx.on("message", message => {
            console.log(`Received message => ${message}`)
            ctx.send(`you said ${message}`)
        })

        ctx.on("close", () => {
            console.log("closed", wss.clients.size)
        })

        // const interval = individualPipeline(ctx)

        ctx.send("connection established.")
    })
}

export default setupWebSocket
