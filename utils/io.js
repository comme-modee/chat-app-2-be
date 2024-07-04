const chatController = require('../controllers/chat.controller')
const userController = require('../controllers/user.controller')

module.exports = function (io) {
    //연결된 사람을 socket이라고 부름 = socket에 받아올 수 있음.
    io.on('connection', async (socket) => {
        console.log('client is connected', socket.id)

        //로그인이라는 제목을 들었을때 하고 싶은 일을 하면 됨
        socket.on('login', async (userName, callback) => {
            try {
                //유저 정보를 저장
                const user = await userController.saveUser(userName, socket.id)

                const welcomeMessage = {
                    chat: `${user.name} is joined to this room`,
                    user: { id: null, name: 'system' }
                }
                io.emit('message', welcomeMessage)
                //프론트로 보내줄 응답값
                callback({ ok: true, data: user })
            } catch (error) {
                callback({ ok: false, error: error.message })
            }
        })

        socket.on('sendMessage', async (message, callback) => {
            try {
                //유저 찾기
                const user = await userController.checkUser(socket.id)
                //메세지 저장
                const newMessage = await chatController.saveChat(message, user)

                //받은 메세지를 채팅방 안에 있는 모든 유저에게 알려줌
                //io.emit -> 서버가 말해준다.
                io.emit('message', newMessage)
                callback({ ok: true })
            } catch (error) {
                callback({ ok: false, error: error.message })
            }
        })

        //socket을 받은 후에 socket의 연결이 끊길 경우 진행되는 로직
        socket.on('disconnect', () => {
            console.log('user is disconnected');
        })
    })
}