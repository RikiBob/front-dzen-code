import { onBeforeUnmount } from 'vue'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true
})

export function useWebSocket(event, callback) {
    socket.on(event, callback)

    onBeforeUnmount(() => {
        socket.off(event, callback)
    })
}
