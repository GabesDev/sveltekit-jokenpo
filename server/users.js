let users = []

const addUser = ({ id, name }) => {
  if (!name) return { error: "No name" }

  name = name.trim().toLowerCase()
  const existingUser = users.find(user => user.name === name)

  if (existingUser) return { error: "Username is taken" }

  const user = {
    id,
    name,
    char: Math.floor(Math.random() * 10 + 1),
    posX: 0,
    posY: 0,
    state: "stopped",
    facing: "down"
  }

  users.push(user)
  return { user }
}

const updateUser = updatedUser => {
  const userIndex = users.findIndex(user => user.id === updatedUser.id)
  if (userIndex === -1) return { error: "User not found" }
  users[userIndex] = updatedUser
  return { users }
}

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}

const getUser = id => users.find(user => user.id === id)

const getUsers = () => users

const makeBusy = busyUser => {
  const userIndex = users.findIndex(user => user.id === busyUser.id)
  if (userIndex === -1) return
  busyUser.state = "busy"
  users[userIndex] = busyUser
}

const makeFree = freeUser => {
  const userIndex = users.findIndex(user => user.id === freeUser.id)
  if (userIndex === -1) return
  freeUser.state = "stopped"
  users[userIndex] = freeUser
}

module.exports = {
  addUser,
  updateUser,
  removeUser,
  getUser,
  getUsers,
  makeBusy,
  makeFree
}
