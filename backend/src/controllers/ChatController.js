import { ChatService } from '../services/ChatService.js'

export class ChatController {
  constructor() {
    this.chatService = new ChatService()
  }

  send = async (req, res) => {
    const chat = await this.chatService.sendMessage(req.user, req.body)
    res.status(201).json(chat)
  }

  myChats = async (req, res) => {
    const chats = await this.chatService.listMyChats(req.user.id)
    res.json(chats)
  }

  byEvent = async (req, res) => {
    const chats = await this.chatService.listChatsByEvent(req.params.eventId)
    res.json(chats)
  }

  all = async (req, res) => {
    const chats = await this.chatService.listAllChats(req.user)
    res.json(chats)
  }

  reply = async (req, res) => {
    const chat = await this.chatService.reply(req.params.chatId, req.body.message)
    res.json(chat)
  }

  messagesByEvent = async (req, res) => {
    const messages = await this.chatService.getMessagesForUserEvent(req.user.id, req.params.eventId)
    res.json(messages)
  }
}
