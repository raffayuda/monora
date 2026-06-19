import { BaseModel } from './BaseModel.js'

export class AuthModel extends BaseModel {
  findUserByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  createUser(data) {
    return this.prisma.user.create({ data })
  }

  findUserById(id) {
    return this.prisma.user.findUnique({ where: { id: BigInt(id) } })
  }
}
