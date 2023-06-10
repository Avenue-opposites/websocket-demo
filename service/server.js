const ws = require('ws');

const sockets = new Set();
const server = new ws.Server({ port: 3000 })
const server2 = new ws.Server({ port: 4000 })

// 监听客户端连接
server.on('connection', (socket) => {
    console.log('Server connected......');
    sockets.add({
        name: 'socket1',
        socket
    })
    // 监听客户端消息
    socket.on('message', (response) => {
        const json = response.toString()
        console.log(json);
        sockets.forEach((item) => {
            if (item.name === 'socket2') {
                item.socket.send(json)
            }
        })
    })
})

// 监听客户端关闭
server.on('close', () => {
    console.log('Server disconnected......');
})

server2.on('connection', (socket) => {
    sockets.add({
        name: 'socket2',
        socket
    })
    // 监听客户端消息
    socket.on('message', (response) => {
        const json = response.toString()
        console.log(json);
        sockets.forEach((item) => {
            if (item.name === 'socket1') {
                item.socket.send(json)
            }
        })
    })
})





