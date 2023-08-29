type Message = {
  uid: string
  user: string
  text: string
}

const messages: Message[] = []

export const addMessage = ({ user: { id, name }, text }: { user: any, text: string }) => {
  const message: Message = { uid: id, user: name, text }
  messages.push(message)
  if (messages.length > 10) messages.shift()
  return { messages }
}

export const getMessages = () => { return { messages } }