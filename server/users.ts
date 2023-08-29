
export const users: User[] = []

export const addUser = ({ id, name }: { id: string, name: string }) => {
  if (!name) return { error: 'No name' }

  name = name.trim().toLowerCase()
  const existingUser = users.find(user => user.name === name)

  if (existingUser) return { error: 'Username is taken' }

  const user = {
    id,
    name,
    char: Math.floor(Math.random() * 10 + 1),
    posX: 0,
    posY: 0,
    state: "stopped" as State,
    facing: "down" as Facing,
  }

  users.push(user)
  return { user }
}

export const updateUser = (updatedUser: User) => {
  const userIndex = users.findIndex(user => user.id === updatedUser.id)
  if (userIndex === -1) return { error: 'User not found' }
  users[userIndex] = updatedUser
  return { users }
}

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) return users.splice(index, 1)[0]
}

export const getUser = (id: string) => users.find(user => user.id === id)

export const getUsers = () => users

export const makeBusy = (busyUser: User) => {
  const userIndex = users.findIndex(user => user.id === busyUser.id)
  if (userIndex === -1) return
  busyUser.state = "busy"
  users[userIndex] = busyUser
}

export const makeFree = (freeUser: User) => {
  const userIndex = users.findIndex(user => user.id === freeUser.id)
  if (userIndex === -1) return
  freeUser.state = "stopped"
  users[userIndex] = freeUser
}