

import { Server } from 'socket.io'
import type { ViteDevServer } from 'vite'
import { addUser, getUser, getUsers, makeBusy, makeFree, removeUser, updateUser } from "./users"
import { addMessage, getMessages } from "./messages"

export default {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return

		const io = new Server(server.httpServer)

		io.on('connection', (socket) => {
			socket.on('join', (name, callback) => {
				const { error, user } = addUser({ id: socket.id, name: name })
				if (error) return callback({ error })

				let allMessages = getMessages()
				io.emit('renderMessages', allMessages)
				renderAll()
				callback({ user })
			})

			socket.on('updatePosition', (user) => {
				updateUser(user)
				renderAll()
			})

			socket.on('newMessage', ({ text }) => {
				let user = getUser(socket.id)
				let allMessages = addMessage({ user, text })
				io.emit('renderMessages', allMessages)
			})

			socket.on('askBattle', (challenged) => {
				let enemy = getUser(socket.id)

				makeBusy(enemy)
				makeBusy(challenged)
				renderAll()

				io.to(challenged.id).emit('challenged', enemy)
				io.to(enemy.id).emit('waiting')
			})

			socket.on('answerBattle', ({ enemy, answer }) => {
				let challenged = getUser(socket.id)
				if (answer) {
					io.to(challenged.id).emit('openModal', enemy)
					io.to(enemy.id).emit('openModal', challenged)
				} else {
					io.to(enemy.id).emit('battleDenied', challenged)
					io.to(challenged.id).emit('battleDenied', enemy)
					makeFree(enemy)
					makeFree(challenged)
					renderAll()
				}
			})

			socket.on('choiceMade', ({ choice, enemy }) => {
				let sender = getUser(socket.id)
				io.to(enemy.id).emit('option', { sender, choice })
			})

			socket.on('battleEnded', (enemy) => {
				let challenged = getUser(socket.id)
				if (enemy) makeFree(enemy)
				if (challenged) makeFree(challenged)
				renderAll()
			})

			socket.on('disconnect', () => {
				removeUser(socket.id)
				renderAll()
			})

			let renderAll = () => {
				const users = getUsers()
				io.emit('renderAll', { users })
			}
		})
	}
}