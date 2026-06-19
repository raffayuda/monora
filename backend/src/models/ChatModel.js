import { BaseModel } from './BaseModel.js'

const includeConversation = {
  messages: { orderBy: { created_at: 'asc' } },
  user: { select: { id: true, name: true } },
}

export class ChatModel extends BaseModel {
  findConversationByUserAndEvent(userId, eventId) {
    return this.prisma.chatConversation.findUnique({
      where: { user_id_event_id: { user_id: BigInt(userId), event_id: BigInt(eventId) } },
    })
  }

  createConversation(data) {
    return this.prisma.chatConversation.create({ data })
  }

  createMessage(data) {
    return this.prisma.chatMessage.create({ data })
  }

  touchConversation(id) {
    return this.prisma.chatConversation.update({ where: { id: BigInt(id) }, data: { updated_at: new Date() } })
  }

  findConversationWithMessagesById(id) {
    return this.prisma.chatConversation.findUnique({ where: { id: BigInt(id) }, include: includeConversation })
  }

  listMyChats(userId) {
    return this.prisma.chatConversation.findMany({
      where: { user_id: BigInt(userId) },
      include: includeConversation,
      orderBy: { updated_at: 'desc' },
    })
  }

  listByEventId(eventId) {
    return this.prisma.chatConversation.findMany({
      where: { event_id: BigInt(eventId) },
      include: includeConversation,
      orderBy: { updated_at: 'desc' },
    })
  }

  listEventIdsByCreator(userId) {
    return this.prisma.event.findMany({ where: { created_by: BigInt(userId) }, select: { id: true } })
  }

  listAll(where = {}) {
    return this.prisma.chatConversation.findMany({
      where,
      include: includeConversation,
      orderBy: { updated_at: 'desc' },
    })
  }

  findConversationByChatId(chatId) {
    if (chatId.includes('-')) {
      const [userId, eventId] = chatId.split('-')
      return this.findConversationByUserAndEvent(userId, eventId)
    }
    return this.prisma.chatConversation.findUnique({ where: { id: BigInt(chatId) } })
  }

  findMessagesForUserEvent(userId, eventId) {
    return this.prisma.chatConversation.findUnique({
      where: { user_id_event_id: { user_id: BigInt(userId), event_id: BigInt(eventId) } },
      include: { messages: { orderBy: { created_at: 'asc' } } },
    })
  }
}
