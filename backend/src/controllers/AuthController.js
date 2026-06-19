import { AuthService } from '../services/AuthService.js'

export class AuthController {
  constructor() {
    this.authService = new AuthService()
  }

  register = async (req, res) => {
    const result = await this.authService.register(req.body)
    res.status(201).json(result)
  }

  login = async (req, res) => {
    const result = await this.authService.login(req.body)
    res.json(result)
  }

  me = async (req, res) => {
    const user = await this.authService.me(req.user.id)
    res.json(user)
  }
}
