import { ApiError } from '../utils/ApiError.js'
import { UserModel } from '../models/UserModel.js'

export class UserService {
  constructor() {
    this.userModel = new UserModel()
  }

  formatUser(u) {
    return {
      id: Number(u.id),
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
      isActive: u.is_active,
      createdAt: u.created_at,
    }
  }

  async listUsers() {
    const users = await this.userModel.listUsers()
    return users.map((u) => this.formatUser(u))
  }

  async updateRole(id, role) {
    const user = await this.userModel.updateRole(id, role)
    return this.formatUser(user)
  }

  async toggleStatus(id) {
    const existing = await this.userModel.findById(id)
    if (!existing) throw new ApiError(404, 'User not found')
    const user = await this.userModel.updateActiveState(id, !existing.is_active)
    return this.formatUser(user)
  }

  async deleteUser(id) {
    await this.userModel.deleteById(id)
    return { success: true }
  }
}
