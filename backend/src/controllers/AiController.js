import { AiService } from '../services/AiService.js'

export class AiController {
  constructor() {
    this.aiService = new AiService()
  }

  chat = async (req, res) => {
    const data = await this.aiService.chatCompletion(req.body)
    res.json(data)
  }
}
