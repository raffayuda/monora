import { BaseModel } from './BaseModel.js'

export class CategoryModel extends BaseModel {
  list() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } })
  }

  create(data) {
    return this.prisma.category.create({ data })
  }

  update(id, data) {
    return this.prisma.category.update({ where: { id: BigInt(id) }, data })
  }

  delete(id) {
    return this.prisma.category.delete({ where: { id: BigInt(id) } })
  }

  findByName(name) {
    return this.prisma.category.findFirst({ where: { name } })
  }
}
