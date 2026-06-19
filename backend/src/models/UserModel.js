import { BaseModel } from './BaseModel.js'

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  is_active: true,
  created_at: true,
}

export class UserModel extends BaseModel {
  listUsers() {
    return this.prisma.user.findMany({
      select: userSelect,
      orderBy: { created_at: 'desc' },
    })
  }

  updateRole(id, role) {
    return this.prisma.user.update({
      where: { id: BigInt(id) },
      data: { role },
      select: userSelect,
    })
  }

  findById(id) {
    return this.prisma.user.findUnique({ where: { id: BigInt(id) } })
  }

  updateActiveState(id, isActive) {
    return this.prisma.user.update({
      where: { id: BigInt(id) },
      data: { is_active: isActive },
      select: userSelect,
    })
  }

  deleteById(id) {
    return this.prisma.user.delete({ where: { id: BigInt(id) } })
  }
}
