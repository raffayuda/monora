import { UserService } from '../services/UserService.js'

export class UserController {
  constructor() {
    this.userService = new UserService()
  }

  list = async (_req, res) => {
    const users = await this.userService.listUsers()
    res.json(users)
  }

  updateRole = async (req, res) => {
    const user = await this.userService.updateRole(req.params.id, req.body.role)
    res.json(user)
  }

  toggleStatus = async (req, res) => {
    const user = await this.userService.toggleStatus(req.params.id)
    res.json(user)
  }

  remove = async (req, res) => {
    const result = await this.userService.deleteUser(req.params.id)
    res.json(result)
  }
}
