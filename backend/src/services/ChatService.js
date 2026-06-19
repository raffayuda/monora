import { ApiError } from '../utils/ApiError.js'
import { ChatModel } from '../models/ChatModel.js'

export class ChatService {
  constructor() {
    this.chatModel = new ChatModel()
  }

  formatChat(c) {
    return {
      id: Number(c.id),
      chatKey: `${c.user_id}-${c.event_id}`,
      userId: Number(c.user_id),
      userName: c.user_name || c.user?.name,
      eventId: Number(c.event_id),
      eventTitle: c.event_title,
      organizerName: c.organizer_name,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      messages: (c.messages || []).map((m) => ({
        id: Number(m.id),
        text: m.message_text,
        sender: m.sender,
        timestamp: m.created_at,
      })),
    }
  }

  async sendMessage(user, payload) {
    const { eventId, eventTitle, organizerName, message } = payload
    let conversation = await this.chatModel.findConversationByUserAndEvent(user.id, eventId)

    if (!conversation) {
      conversation = await this.chatModel.createConversation({
        user_id: BigInt(user.id),
        event_id: BigInt(eventId),
        user_name: user.name,
        event_title: eventTitle || null,
        organizer_name: organizerName || null,
      })
    }

    await this.chatModel.createMessage({
      conversation_id: conversation.id,
      sender: 'customer',
      message_text: message,
    })
    await this.chatModel.touchConversation(conversation.id)

    const full = await this.chatModel.findConversationWithMessagesById(conversation.id)
    return this.formatChat(full)
  }

  async listMyChats(userId) {
    const rows = await this.chatModel.listMyChats(userId)
    return rows.map((c) => this.formatChat(c))
  }

  async listChatsByEvent(eventId) {
    const rows = await this.chatModel.listByEventId(eventId)
    return rows.map((c) => this.formatChat(c))
  }

  async listAllChats(user) {
    let where = {}
    if (user.role === 'event_admin') {
      const myEvents = await this.chatModel.listEventIdsByCreator(user.id)
      where = { event_id: { in: myEvents.map((e) => e.id) } }
    }
    const rows = await this.chatModel.listAll(where)
    return rows.map((c) => this.formatChat(c))
  }

  async reply(chatId, message) {
    const conversation = await this.chatModel.findConversationByChatId(chatId)
    if (!conversation) throw new ApiError(404, 'Conversation not found')

    await this.chatModel.createMessage({
      conversation_id: conversation.id,
      sender: 'organizer',
      message_text: message,
    })
    await this.chatModel.touchConversation(conversation.id)

    const full = await this.chatModel.findConversationWithMessagesById(conversation.id)
    return this.formatChat(full)
  }

  async getMessagesForUserEvent(userId, eventId) {
    const conversation = await this.chatModel.findMessagesForUserEvent(userId, eventId)
    if (!conversation) return []
    return conversation.messages.map((m) => ({
      id: Number(m.id),
      text: m.message_text,
      sender: m.sender,
      timestamp: m.created_at,
    }))
  }
}
