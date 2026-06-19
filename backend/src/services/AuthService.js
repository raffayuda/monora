import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { AuthModel } from '../models/AuthModel.js'

export class AuthService {
  constructor() {
    this.authModel = new AuthModel()
  }

  signToken(user) {
    return jwt.sign(
      { id: Number(user.id), email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  safeUser(user) {
    return {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at,
    }
  }

  async register(payload) {
    const { name, email, password, phone, role } = payload
    if (!name || !email || !password) {
      throw new ApiError(400, 'Name, email and password are required')
    }

    const existing = await this.authModel.findUserByEmail(email)
    if (existing) throw new ApiError(400, 'Email already registered')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await this.authModel.createUser({
      name,
      email,
      password_hash: passwordHash,
      phone: phone || null,
      role: role || 'customer',
    })

    return { token: this.signToken(user), user: this.safeUser(user) }
  }

  async login(payload) {
    const { email, password } = payload
    if (!email || !password) throw new ApiError(400, 'Email and password are required')

    const user = await this.authModel.findUserByEmail(email)
    if (!user) throw new ApiError(401, 'Invalid email or password')
    if (!user.is_active) throw new ApiError(403, 'Account is deactivated')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new ApiError(401, 'Invalid email or password')

    return { token: this.signToken(user), user: this.safeUser(user) }
  }

  async me(userId) {
    const user = await this.authModel.findUserById(userId)
    if (!user) throw new ApiError(404, 'User not found')
    return this.safeUser(user)
  }
}
